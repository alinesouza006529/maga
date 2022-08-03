 
/* Arquivo de configuração de enconding UTF-8 with BOM, favor não alterar */
window.ItauJs = {};

if (window.Module == undefined) {
	(function(window){
		window.Module = {
			modules : {},
			register : function(name, fn){
				if(typeof fn === "function"){
					Module.modules[name] = fn;
				}
			},
			call : function(name){
				try {
					if(typeof name === "string"){
						Module.modules[name](window);
					} else if(name.length != undefined && name.length > 0){
						for(var i = 0; i < name.length; i++) {
							var modulo = name[i];
							try {
								Module.modules[modulo](window);
							} catch (e) {
								if(console != undefined){
									console.log("Modulo:" + modulo)
									console.log(e);
								}
							}
						}
					}
				} catch (e){
					if(console != undefined){
						console.log("Modulo:" + name)
						console.log(e);
					}
				}
			}
		};
	})(window);
}

ItauJs.Exception = function() {
    var $scope = {};
    var $scopePrivate = {};
    
    $scopePrivate.init = function(){
        $scopePrivate.initVars();
        $scopePrivate.initLayout();
        return $scope;
    };
    
    $scopePrivate.initVars = function() {
    	$scope.ERROR_TYPE = {
		SYSTEMA_INDISPONIVEL : "1",
		EXCEPTION_DEFAULT : "2",
		SESSAO_FINALIZADA : "3"
	};
    };

    $scopePrivate.errorTypeToString = function(errorType){
	    var retorno = null;
		switch(errorType){
			case $scope.ERROR_TYPE.SYSTEMA_INDISPONIVEL :
				retorno = "SYSTEMA_INDISPONIVEL";
				break;
			case $scope.ERROR_TYPE.EXCEPTION_DEFAULT :
				retorno = "EXCEPTION_DEFAULT";
				break;
			case $scope.ERROR_TYPE.SESSAO_FINALIZADA :
				retorno = "SESSAO_FINALIZADA";
				break;
		}
		return retorno;
	};
    
    $scopePrivate.initLayout = function() {
        $(function() {
        	$scopePrivate.jsCloseCtr();
        });
        $scopePrivate.implementAjax();
    };

    $scopePrivate.jsCloseCtr = function() {
		var seletor = ".js-close";
		$('body').on("click", seletor,function() {
			$(this).parent('.js-alerta-error').hide(300, function() {
				$(this).remove();
			});
		});
		$(document).ajaxStart(function(){
			$('.js-alerta-error').remove();
		});
	};

    $scope.createBoxAviso = function(msg){
		var box = [
		'<div class="box-info box-info-alerta js-alerta-error" role="alert">',
			'<span class="icone js-close"></span>',
        		'<p>' + msg + '</p>',
			'<span class="fechar js-close" >Fechar mensagem</span>',
		'</div>'];
		return box.join("");
	};

	$scopePrivate.getTypeError = function(data) {
	    var respose = null;
		try {
			respose = jQuery.parseJSON(data);
	    }catch(e){
	    	respose = data;
		}
		var error = null;
		if(typeof respose === 'object'){
	    	if(respose.ok != undefined && respose.ok == false){
	    		error = {type: $scope.ERROR_TYPE.SYSTEMA_INDISPONIVEL, msg : respose.object};
		    }
	    }else if(typeof respose === 'string'){
	    	if(respose.indexOf("js-exception") > -1 ){
	    		error = {type: $scope.ERROR_TYPE.EXCEPTION_DEFAULT, msg : $(respose).find('.js-msg-error').html()};
	    	}else if(respose.indexOf("js-session-expired") > -1 || respose.indexOf("contentErrorPage") > -1) {
	    		error = {type: $scope.ERROR_TYPE.SESSAO_FINALIZADA, msg : null};
		    }
		}
	    return error;
	};

	$scopePrivate.showMsgError = function(error,data) {
		var errorType = error.type;
		var html = "";
		if(errorType == $scope.ERROR_TYPE.EXCEPTION_DEFAULT){
			html = data;
		}else if(errorType == $scope.ERROR_TYPE.SESSAO_FINALIZADA){
			html = data;
		}else if(errorType == $scope.ERROR_TYPE.SYSTEMA_INDISPONIVEL){
			if($(".js-alerta-error").length == 0){
				$('#content').find('h1').first().after($scope.createBoxAviso(error.msg));
			}
			return;
		}
		$('#content').empty().append(html);		
	};
    
	$scope.CatchException = function(funcao, fnError) {			    
		try {
			if(typeof funcao === "function") {
				funcao();
			}
    	}catch(e){
    		if(console !== undefined){
    			console.log(e);
    		}
    		if(typeof fnError === "function") {
    			fnError(e);
    		}
	    }
    };
	
    $scope.CatchAjaxException = function(data,fnSuccess,fnError) {			    
    	var error = $scopePrivate.getTypeError(data);
    	
    	if(error == null){
	    	try {
    			fnSuccess(data);
	    	}catch(e){

		    }
	    }else if(typeof fnError === "function") {
	    	fnError({
				data : data,
				errorType : $scopePrivate.errorTypeToString(error.type),
				msg : error.msg,
				tratamentoDefault : function() {
					$scopePrivate.showMsgError(error,data);
				}
		    });
		}else {
			$scopePrivate.showMsgError(error,data);
		}
    };
    
    $scopePrivate.implementAjax = function() {
    	jQuery.Ajax = function(options) {
    		var params = {};
    		$.extend(params,options);
    		
    	    if(options.success !== undefined && typeof options.success === "function"){
    	    	if(options.error !== undefined && typeof options.error === "function"){
    	    		params.success = function(data){
									try {
										ItauJs.Exception().CatchAjaxException(data, function(){
											options.success(data);
										}, function(error) {
											options.error(error);
										});
									} catch(e) {
										console.error("Erro ao executar sucesso do ajax", e);
									}
    	        		
    	    		};
    	    	}else{
    	    		params.success = function(data){
									try {
										ItauJs.Exception().CatchAjaxException(data, function(){
												options.success(data);
										});
									} catch(e) {
										console.error("Erro ao executar error do ajax", e);
									}
    	    		};
    	      }
    	    }
    	    
    	 	return $.ajax(params);
			
    	};
    	
    }

    return $scopePrivate.init();
};

ItauJs.DownloadManager = function() {
	
	var $scope = this;
	var $scopePrivate = {};
	
	$scopePrivate.init = function(){
		if($scope === Window){
			return $scope;
		}else {
	        $scopePrivate.initVars();
	        $scopePrivate.initLayout();
	        return $scope;
		}
    };
    
    $scopePrivate.initVars = function() {
        
    };
    
    $scopePrivate.convertTextEncoding = function(text){
    	var tf2 =new Array("Á","á","Â","â","À","à","Å","å","Ã","ã","Ä","ä","Æ","æ","É","é","Ê","ê","È","è","Ë","ë","Í","í","Î","î","Ì","ì","Ï","ï","Ó","ó","Ô","ô","Ò","ò","Õ","õ","Ö","ö","Ú","ú","Û","û","Ù","ù","Ü","ü","Ç","ç","Ñ","ñ");
    	var tf1=new Array("&Aacute;","&aacute;","&Acirc;","&acirc;","&Agrave;","&agrave;","&Aring;","&aring;","&Atilde;","&atilde;","&Auml;","&auml;","&AElig;","&aelig;","&Eacute;","&eacute;","&Ecirc;","&ecirc;","&Egrave;","&egrave;","&Euml;","&euml;","&Iacute;","&iacute;","&Icirc;","&icirc;","&Igrave;","&igrave;","&Iuml;","&iuml;","&Oacute;","&oacute;","&Ocirc;","&ocirc;","&Ograve;","&ograve;","&Otilde;","&otilde;","&Ouml;","&ouml;","&Uacute;","&uacute;","&Ucirc;","&ucirc;","&Ugrave;","&ugrave;","&Uuml;","&uuml;","&Ccedil;","&ccedil;","&Ntilde;","&ntilde;");
    	for (var ii = 0; ii < tf1.length; ii++) {
    		text = text.replace(new RegExp(tf1[ii],"g"),tf2[ii]);        
    	}   
    	return text;
    };
    
    $scopePrivate.convertDataURIToBinary = function (arrayBuffer) {
  	  var raw = arrayBuffer;
  	  var rawLength = raw.length;
  	  var array = new Uint8Array(new ArrayBuffer(rawLength));

  	  for(var i = 0; i < rawLength; i++) {
  	    array[i] = raw.charCodeAt(i);
  	  }
  	  return array;
  	};
    
    $scopePrivate.initLayout = function() {
        
    };
    
    $scopePrivate.createBlob = function(data, contentType) {
	  	  if (typeof Blob !== 'undefined') {
	  	    return new Blob([data], { type: contentType });
	  	  }
	  	  var bb = new MozBlobBuilder();
	  	  bb.append(data);
	  	  return bb.getBlob(contentType);
	};
	
	$scope.download = function(buffer, aplication, fileName) {
		buffer = $scopePrivate.convertTextEncoding(buffer);
    	var fileBinary = $scopePrivate.convertDataURIToBinary(buffer);
		var downloadManager = new $scopePrivate.DownloadManager();
		var blob = $scopePrivate.createBlob(fileBinary, aplication);
		downloadManager.download(blob, null, fileName);
    };
	
	
	$scopePrivate.DownloadManager = (function DownloadManagerClosure() {
    	  function DownloadManager() {};
		  function download(blobUrl, filename) {
		    var a = document.createElement('a');
		    if (a.click) {
		      a.href = blobUrl;
		      a.target = '_parent';
		      if ('download' in a) {
		        a.download = filename;
		      }
		      (document.body || document.documentElement).appendChild(a);
		      a.click();
		      a.parentNode.removeChild(a);
		    } else {
		      if (window.top === window &&
		        blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
		        var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
		        blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
		      }
		      window.open(blobUrl, '_parent');
		    }
		  }

	  

	  DownloadManager.prototype = {
	    downloadUrl: function DownloadManager_downloadUrl(url, filename) {
	      if (!PDFJS.isValidUrl(url, true)) {
	        return; 
	      }
	      download(url + '#pdfjs.action=download', filename);
	    },
	    downloadData: function DownloadManager_downloadData(data, filename, contentType) {
	      if (navigator.msSaveBlob) {
	        return navigator.msSaveBlob(new Blob([data], { type: contentType }),filename);
	      }
	      var blobUrl = PDFJS.createObjectURL(data, contentType);
	      download(blobUrl, filename);
	    },

	    download: function DownloadManager_download(blob, url, filename) {
	      if (!URL) {
	        this.downloadUrl(url, filename);
	        return;
	      }

	      if (navigator.msSaveBlob) {
	        if (!navigator.msSaveBlob(blob, filename)) {
	          this.downloadUrl(url, filename);
	        }
	        return;
	      }

	      var blobUrl = URL.createObjectURL(blob);
	      download(blobUrl, filename);
	    }
	  };

	  return DownloadManager;
	})();
    
    return $scopePrivate.init();
};

ItauJs.Print = (function() {
	var $scope = this;
	var $scopePrivate = {};

	$scope.imprimir = function(PrintObj){
		var validacao = $scopePrivate.valeidatePrintObj(PrintObj);
		if(validacao.status == true){
			PrintObj.setWindow(window.open());
			$(PrintObj.getWindow().document.body).html('<div class="contentPrint"></div><div class="contentPrint2"></div>');	
			$scopePrivate.addHeaders(PrintObj.getWindow(), PrintObj.getResourcesRoot());				
			var body = $(PrintObj.getWindow().document.body).find('.contentPrint').append($(PrintObj.getHtml()));
			setTimeout(function() {
				PrintObj.callFnBefore($(PrintObj.getWindow().document.body));
				$scopePrivate.paginacaoImpressao(PrintObj.getWindow(),PrintObj.getTitle());
				PrintObj.getWindow().print();
				PrintObj.getWindow().close();
				PrintObj.callFnAfter(body);
			}, 1000);
		}else{
			//alert(validacao.msg);
		}
	};

	$scopePrivate.valeidatePrintObj = function(PrintObj) {
		var validacao = {status: true, msg : []};
		if(PrintObj.getHtml().toString().length == 0){
			validacao.msg.push("Campo html é obrigatório"); 
		}
		if(PrintObj.getTitle().toString().length == 0){
			validacao.msg.push("Campo title é obrigatório"); 
		}
		if(PrintObj.getResourcesRoot().toString().length == 0){
			validacao.msg.push("Campo resourcesRoot é obrigatório"); 
		}

		if(validacao.msg.length > 0){
			validacao.status = false;
			validacao.msg = validacao.msg.join("\n");
		}

		return validacao;
	};
	
	$scope.createPrintObj = function(){
		var $scope = this;
		var $scopePrivate = {};

		$scope.init = function() {
			$scopePrivate.initVars();
            return $scope;
		};

		$scope.setWindow = function(window) {
			$scopePrivate.window = window;
			return $scope;
		};

		$scope.getWindow = function() {
			return $scopePrivate.window;
		};

		$scope.setHtml = function(html) {
			$scopePrivate.html = html;
			return $scope;
		};

		$scope.getHtml = function() {
			return $scopePrivate.html;
		};

		$scope.setTitle = function(title) {
			$scopePrivate.title = title;
			return $scope;
		};

		$scope.getTitle = function() {
			return $scopePrivate.title;
		};

		$scope.setResourcesRoot = function(resourcesRoot) {
			$scopePrivate.resourcesRoot = resourcesRoot;
			return $scope;
		};

		$scope.getResourcesRoot = function() {
			return $scopePrivate.resourcesRoot;
		};

		$scope.setFnBefore = function(fnBefore) {
			$scopePrivate.fnBefore = fnBefore;
			return $scope;
		};

		$scope.setFnAfter = function(fnAfter) {
			$scopePrivate.fnAfter = fnAfter;
			return $scope;
		};

		$scope.callFnBefore = function(body) {
			$scopePrivate.fnBefore(body);
		};

		$scope.callFnAfter = function(body) {
			$scopePrivate.fnAfter(body);
		};
		
		$scopePrivate.initVars = function() {                                	
			$scopePrivate.window = null;
            $scopePrivate.html = "";
            $scopePrivate.title = "";
            $scopePrivate.resourcesRoot = "";
            $scopePrivate.fnBefore = function() {};
            $scopePrivate.fnAfter = function() {};
		};
		
		return $scope.init();
	};

	$scopePrivate.addHeaders = function(window, resourcesRoot) {
		$(window.document.body).append('<meta charset="utf-8" /><!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><![endif]-->');
		$(window.document.body).append('<meta name="robots" content="noindex,nofollow" />');
		$(window.document.body).append('<meta name="viewport" content="width=device-width" />');
		$(window.document.body).append('<meta name="description" content="" />');
		$(window.document.body).append('<meta name="keywords" content="" />');			
		$(window.document.body).append('<link rel="stylesheet" href="' + resourcesRoot + '/commons/css/itau-style-pages.css" media="all">');
		$(window.document.body).append('<link rel="stylesheet" href="' + resourcesRoot + '/commons/css/itau-style.css" media="all">');
		$(window.document.body).append('<link rel="stylesheet" href="' + resourcesRoot + '/commons/css/itau-form-style.css" media="all">');
	};
    
    

	$scopePrivate.paginacaoImpressao = function(window,title){
		var $scope = {};
		var contentPrint = $(window.document.body).find(".contentPrint");		
		var page = 1;
		
		$scope.createPage = function() {
			var headerHtml = "<div class='pagina quebra-pagina-impressao impressao-A4 page-" + page + "'><h2>" + title + " - &nbsp;<small>- página " + page + "</small></h2></div>";
			contentPrint.parent("body").append(headerHtml);
			return contentPrint.parent("body").find(".page-" + page);
		};

		$scope.appendElementBreaked = function(seletor,sizeRestante,paginaHtml) {        

			var tagName = $(seletor).prop("tagName");
			var sumTr = 0;
			var table = null;
	        var tablesList = [];
			var contTables = 0;
			var quebra = "";
			var list = $(seletor).children();
			paginaHtml.append($(seletor));

			if(tagName == "TABLE") {
				list = $(seletor).find(">thead >tr , > tbody > tr");
			}
			
			list.each(function() {
			    var trHeight = $(this).outerHeight(true);
			    sumTr += trHeight;
			    if(sumTr > sizeRestante) {
			    	paginaHtml = $scope.createPage();
					page++;
			        quebra = "quebra_" + sumTr;
			        var elementNew = $(seletor).clone();
			        elementNew.empty();
			        elementNew.addClass(quebra);                
			        paginaHtml.append(elementNew);
			        table = $("." + quebra);
			        tablesList.push("." + quebra);
			        sumTr = 0;
			        sizeRestante = $scopePrivate.SIZE_A4;
			     }
			    
			     if(table != null){
			        paginaHtml.find("." + quebra).append($(this));
			     }
		    });
			
			

		};
		
		$scope.getSizePage = function(paginaHtml) {
			var size = 0;
			paginaHtml.children().each(function(){
				size+= $(this).outerHeight(true);
			});
			return size;
		};
        
		contentPrint.children().each(function(i) {
				var elementAtual = $(this);
				var paginaHtml = contentPrint.parent("body").find(".page-" + (page -1));
				var sizePageAtual = ($scope.getSizePage(paginaHtml));
				var sizeElemento = elementAtual.outerHeight(true); 
				var createNewPage = elementAtual.hasClass("new-page");
	            var tagName = elementAtual.prop("tagName");	           	           

	            if(page == 1  || createNewPage == true){
					paginaHtml = $scope.createPage();
					page++;
				}
	            
	            if(sizePageAtual + sizeElemento >= $scopePrivate.SIZE_A4 && createNewPage == false && page  != 1){
	            	$scope.appendElementBreaked($(this),$scopePrivate.SIZE_A4 - sizePageAtual, paginaHtml);
	            }else{
					paginaHtml.append(elementAtual);
	            }
		});

	};
	
	$scopePrivate.initVars = function() {
		$scopePrivate.SIZE_A4 = 1300; 	
		$scopePrivate.contentPrint2 = $(window.document.body).find(".contentPrint2");	
	};
	
	$scope.init = function() {
		$scopePrivate.initVars();
		return $scope;
	};
	
    return $scope.init();
});

ItauJs.PDF = function() {
    var $scope = {};
    var $scopePrivate = {};
    
    $scopePrivate.init = function(){
        $scopePrivate.initVars();
        $scopePrivate.initLayout();
        return $scope;
    };
    
    $scopePrivate.initVars = function() {
        
    };
    
    $scopePrivate.convertDataURIToBinary = function (arrayBuffer) {
	  var raw = arrayBuffer;
	  var rawLength = raw.length;
	  var array = new Uint8Array(new ArrayBuffer(rawLength));

	  for(var i = 0; i < rawLength; i++) {
	    array[i] = raw.charCodeAt(i);
	  }
	  return array;
	};
    
    $scopePrivate.createBlob = function(data, contentType) {
	  	  if (typeof Blob !== 'undefined') {
	  	    return new Blob([data], { type: contentType });
	  	  }
	  	  var bb = new MozBlobBuilder();
	  	  bb.append(data);
	  	  return bb.getBlob(contentType);
	};
	
	$scopePrivate.DownloadManager = (function DownloadManagerClosure() {

	  function download(blobUrl, filename) {
	    var a = document.createElement('a');
	    if (a.click) {
	      a.href = blobUrl;
	      a.target = '_parent';
	      if ('download' in a) {
	        a.download = filename;
	      }
	      (document.body || document.documentElement).appendChild(a);
	      a.click();
	      a.parentNode.removeChild(a);
	    } else {
	      if (window.top === window &&
	        blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
	        var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
	        blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
	      }
	      window.open(blobUrl, '_parent');
	    }
	  }

	  function DownloadManager() {}

	  DownloadManager.prototype = {
	    downloadUrl: function DownloadManager_downloadUrl(url, filename) {
	      if (!PDFJS.isValidUrl(url, true)) {
	        return; 
	      }
	      download(url + '#pdfjs.action=download', filename);
	    },
	    downloadData: function DownloadManager_downloadData(data, filename, contentType) {
	      if (navigator.msSaveBlob) {
	        return navigator.msSaveBlob(new Blob([data], { type: contentType }),filename);
	      }
	      var blobUrl = PDFJS.createObjectURL(data, contentType);
	      download(blobUrl, filename);
	    },

	    download: function DownloadManager_download(blob, url, filename) {
	      if (!URL) {
	        this.downloadUrl(url, filename);
	        return;
	      }

	      if (navigator.msSaveBlob) {
	        if (!navigator.msSaveBlob(blob, filename)) {
	          this.downloadUrl(url, filename);
	        }
	        return;
	      }

	      var blobUrl = URL.createObjectURL(blob);
	      download(blobUrl, filename);
	    }
	  };

	  return DownloadManager;
	})();
    
    $scopePrivate.initLayout = function() {
        $(function() {
            
        });
    };
    
    $scopePrivate.convertTextEncoding = function(text){
    	var tf2 =new Array("Á","á","Â","â","À","à","Å","å","Ã","ã","Ä","ä","Æ","æ","É","é","Ê","ê","È","è","Ë","ë","Í","í","Î","î","Ì","ì","Ï","ï","Ó","ó","Ô","ô","Ò","ò","Õ","õ","Ö","ö","Ú","ú","Û","û","Ù","ù","Ü","ü","Ç","ç","Ñ","ñ");
    	var tf1=new Array("&Aacute;","&aacute;","&Acirc;","&acirc;","&Agrave;","&agrave;","&Aring;","&aring;","&Atilde;","&atilde;","&Auml;","&auml;","&AElig;","&aelig;","&Eacute;","&eacute;","&Ecirc;","&ecirc;","&Egrave;","&egrave;","&Euml;","&euml;","&Iacute;","&iacute;","&Icirc;","&icirc;","&Igrave;","&igrave;","&Iuml;","&iuml;","&Oacute;","&oacute;","&Ocirc;","&ocirc;","&Ograve;","&ograve;","&Otilde;","&otilde;","&Ouml;","&ouml;","&Uacute;","&uacute;","&Ucirc;","&ucirc;","&Ugrave;","&ugrave;","&Uuml;","&uuml;","&Ccedil;","&ccedil;","&Ntilde;","&ntilde;");
    	for (var ii = 0; ii < tf1.length; ii++) {
    		text = text.replace(new RegExp(tf1[ii],"g"),tf2[ii]);        
    	}   
    	return text;
    };
    
    $scope.download = function(bufferPDF , fileName) {
    	bufferPDF = $scopePrivate.convertTextEncoding(bufferPDF);
    	var pdfBinary = $scopePrivate.convertDataURIToBinary(bufferPDF);
		var downloadManager = new $scopePrivate.DownloadManager();
		var blob = $scopePrivate.createBlob(pdfBinary, 'application/pdf');
		downloadManager.download(blob, null, fileName + ".pdf");
    };
    
    $scope.fromHTML = function (seletorContent, fileName) {		
		var template = $('#templatePrintAndPDF').html();
		var content = $(seletorContent).clone().html();
		var item = {content : content};
		var html = Mustache.render(template,item);
		html = convertTextEncoding(html);
		$.Ajax({
			dataType : "text",
			method : "POST",
			data : {
				html : html
			},
			headers : {
				'op' : $("#opHtmlToPDF").val(),
				ajaxRequest : true,
				scrollToTop : false
			},
			success : function(data) {
				$scope.download(data, fileName);
			}
		});
	};

    return $scopePrivate.init();
};

ItauJs.Log = function() {
    var $scope = {};
    var $scopePrivate = {};
    
    $scopePrivate.init = function(){
        $scopePrivate.initVars();
        $scopePrivate.initLayout();
        return $scope;
    };
    
    $scopePrivate.initVars = function() {
	    if(ItauJs.logAjax == undefined){
	    	ItauJs.logAjax = [];
		}
    };

    $scope.getLogPage = function() {
		return ItauJs.logAjax;
	};
    
    $scopePrivate.initLayout = function() {
        $(function() {
        	$scopePrivate.ajaxCtr();
        });
    };

    $scopePrivate.ajaxCtr = function() {
    	if($("html").hasClass("ItauJsLog") == false){
		$("html").addClass("ItauJsLog");	
	    	$( document ).ajaxSend(function( event, jqxhr, settings ) {	
	    		if(settings.headers != undefined){
		     		if(settings.headers.op != undefined){
					var op = settings.headers.op;
					$('[data-op="'+ op + '"]').eq(0).each(function(){
						var tagName = $(this).prop("tagName");
						var page = "";
						if(tagName == "A"){
							page = $.trim($(this).text());
					    }
					    if(page.length == ""){
					    	page = "HOME";
						}
						ItauJs.logAjax.push({
							"page" : page,
							"element" : $(this)
						});
						if(ItauJs.logAjax.length > 2){
							ItauJs.logAjax.shift();
						}
					});
				}
	    	       }
		});	
       }	
    };

    return $scopePrivate.init();
};

ItauJs.Search = function() {
	var $scope = {};
	var $scopePrivate = {};

	$scope.init = function() {
		$scopePrivate.initVars();
		$scopePrivate.initLayout();
		return $scope;
	};

	$scopePrivate.initVars = function() {

	};

	$scopePrivate.initLayout = function() {
		$(function() {
			$scopePrivate.listenJsFilter();
		});
	};

	$scope.createSearchObj = function() {
		var $scope = {};
		var $scopePrivate = {};

		$scope.init = function() {
			$scopePrivate.initVars();
			$scopePrivate.initLayout();
			return $scope;
		};

		$scopePrivate.initVars = function() {
			$scopePrivate.seletor = "";
			$scopePrivate.text = "";
		};

		$scopePrivate.initLayout = function() {
			$(function() {

			});
		};

		$scope.setText = function(text) {
			$scopePrivate.text = text;
			return $scope;
		};

		$scope.setSeletor = function(seletor) {
			$scopePrivate.seletor = seletor;
			return $scope;
		};

		$scope.getText = function() {
			return $scopePrivate.text;
		};

		$scope.getSeletor = function() {
			return $scopePrivate.seletor;
		};

		return $scope.init();
	};
	
	$scope.findText = function(SearchObj) {
		var query = SearchObj.getText();
		$('.txt-destaque-busca').removeClass('txt-destaque-busca');
		if (query !== "") {
		   var pesquisa = query.replace(/[ç]/g,'c').replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u');
	       $(SearchObj.getSeletor()).each(function(){
	       	var palavra = $(this).text().replace(/[ç]/g,'c').replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u');
	           if(palavra.toUpperCase().indexOf(pesquisa.toUpperCase()) !== -1){
	               $(this).addClass('txt-destaque-busca');
	           }
	       });
		}
	};

	$scope.hasText = function(text, textSeach) {
		var query = textSeach;
		if (query !== "") {
		   var pesquisa = query.replace(/[ç]/g,'c').replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u');				      
	       var palavra = text.replace(/[ç]/g,'c').replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u');
		
           if(palavra.toUpperCase().indexOf(pesquisa.toUpperCase()) !== -1){
              return true;
           }
		}else{
			return true;
		}
		return false;
	};

	$scopePrivate.tableToJson = function(seletor) {
		var table = $(seletor);
		var tableJson = [];
		table.find("tr").each(function() {
			var linha = $(this);
			var linhaJson = [];
			linha.children().each(function(){
				var tagName = $(this).prop("tagName");	
				if(tagName == "TD"){
					var texto = $(this).text();
					linhaJson.push(texto);
				}
			});
			if(linhaJson.length > 0){
				tableJson.push(linhaJson);
			}
		});
		return tableJson;
	}

	$scopePrivate.setParentsJsFilter = function(model) {
		$("ul[js-filter='" + model + "']").each(function(index ) {
			$(this).children().attr("js-filter",model);
			$(this).removeAttr("js-filter");
		});
		$("th[js-filter='" + model + "']").each(function(index ) {
			$(this).parent("tr").nextAll().each(function(){
				$(this).find("td").eq(index).attr("js-filter",model);
			});
			$(this).removeAttr("js-filter");
		});
		$("[js-filter='" + model + "']").each(function(index ) {
			var tagName = $(this).prop("tagName");
			var parent = null;
			if(tagName == "TD"){
				parent = $("[js-filter='" + model + "']").parents("table");	
			}else if(tagName == "LI") {
				parent = $("[js-filter='" + model + "']").parents("ul");	
			}
			parent.addClass("js-parent-element");
		});
	};
	
	$scopePrivate.jsFilter = function() {			
		$("body").find("input").each(function() {														
			var jsModel = $(this);
			if(jsModel.attr("js-model") != undefined  && jsModel.attr("js-model-loaded") != "true"){
				jsModel.attr("js-model-loaded","true");
				var model = (jsModel.attr("js-model"));
				$scopePrivate.setParentsJsFilter(model);
				
				$(".js-parent-element").find("[js-filter='" + model + "']").each(function(i){
					var classe = "js-odd";
					var tagName = $(this).prop("tagName");
					if(i % 2 ==0){
						classe = "js-even";
					}
					if(tagName == "TD"){
						$(this).parent("tr").addClass(classe);
					}else{
						 $(this).addClass(classe);
					}
				});
			 	
				var search = function(jsModel) {
						$(".js-parent-element").each(function(){
								var element = $(this).find("[js-filter='" + model + "']");
								var tagName = $(this).find("[js-filter='" + model + "']").first().prop("tagName");
								
								if(tagName == "TD"){
									element = $(this).find("[js-filter='" + model + "']").parent("tr");
								}

								var filters = $(this).attr("js-filters");
								
								if(filters == undefined){
									filters = {};
								}else{
									filters = JSON.parse(filters);
								}	
								
								filters[model] = jsModel.val();
								var hasTextObj = [];
								for (var prop in filters) {
									var valorProcurado = filters[prop];				
									$(this).find("[js-filter='" + prop + "']").each(function(index ) {
										var textFilter = $(this).text();
										if($(this).find('.js-text').length > 0){
											textFilter = "";
											$(this).find('.js-text').each(function() {
												textFilter += $(this).text();
											});
										}
										var hasText = ItauJs.Search().hasText(textFilter,valorProcurado)
										if(hasTextObj[index] == undefined){
											hasTextObj[index] = [];
										}
										hasTextObj[index].push({"prop" : prop, "hasText" : hasText});
							         });
								}
								element.show();
								for(var i = 0, count = 0; i < hasTextObj.length; i ++){
									var filtros = hasTextObj[i];
									var hidden = false;
									for(var j = 0; j < filtros.length; j++){
										var filtro = filtros[j];
										if(filtro.hasText == false){
											hidden = true;
											break;
										}
									}

									if(tagName == "TD"){
										$(this).find("[js-filter='" + model + "']").eq(i).parent("tr").removeClass("js-odd").removeClass("js-even");
									}else{
										element.eq(i).removeClass("js-odd").removeClass("js-even");
									}
									
									if(hidden == true){
										if(tagName == "TD"){
											$(this).find("[js-filter='" + model + "']").eq(i).parent("tr").hide();
										}else{
											element.eq(i).hide();
										}
									}else{
										var classe = "js-odd";
										if(count % 2 ==0){
											classe = "js-even";
										}
										if(tagName == "TD"){
											$(this).find("[js-filter='" + model + "']").eq(i).parent("tr").addClass(classe);
										}else{
											element.eq(i).addClass(classe);
										}
										count++;
									}
								}
								
								$(this).attr("js-filters", JSON.stringify(filters));
								$("input[js-model='" + model + "']").val(jsModel.val());

					});
				}
				$(this).on({
					keypress : function() {
						search(jsModel);
					},
					keyup : function() {
						search(jsModel);
					}
				});	
			}
			
		});
	}

	$scopePrivate.listenJsFilter = function() {					
		if($("body").hasClass("JsFilter") == false){
			$("body").addClass("JsFilter");
			$("body").on({
				"mousemove" : function() {
					$scopePrivate.jsFilter();
				},
				"keyup" : function() {
					$scopePrivate.jsFilter();
				}
			});
		}
	}
	
	return $scope.init();
};

(function(window){
	function creteInputNumeric(seletor) {
		var valAtual = $(seletor).val().replace(/[^0-9]/g, '');
		
		$(seletor).before("<input type='number' pattern='[0-9]*' data-target='" + seletor + "'  />");
		$(seletor).css("z-index", "+=1000");
		$("[data-target='" + seletor + "']").addClass("number-oculto")
		.on("focusin", function(){
			$(seletor).addClass("number-focus").removeClass("number-default");
			$(this).val(valAtual);
		}).on("focusout", function(){
			$(seletor).addClass("number-default").removeClass("number-focus");	
		}).focus();
		
		$("[data-target='" + seletor + "']").on("keyup", function() {
			sincVal(this,seletor);
		}).on("focusout", function() {
			dropInputNumeric(seletor);
		}).on("input", function() {
			sincVal(this,seletor);
		});
	
	}

	function validaMaxLength(objNumber,seletorTarget) {
		var maxLen = $(seletorTarget).attr("maxlength");
		var valInputText = $(seletorTarget).val();
		var valInputNumber = $(objNumber).val();
		if(valInputText.length > maxLen){
			$(seletorTarget).val(valInputText.slice(0, valInputText.length - 1));
			$(objNumber).val(valInputNumber.slice(0, valInputNumber.length - 1));
		}
		
	}
	
	function sincVal(obj,seletorTarget) {
		var val = $(obj).val();
		$(obj).val(val.replace(/[^0-9]/g, ''));	
		$(seletorTarget).val(val);
		$(seletorTarget).trigger("keyup");
		$(seletorTarget).trigger("keypress");
		$(seletorTarget).trigger("keydown");
		validaMaxLength(obj,seletorTarget);
	}
	
	function dropInputNumeric(seletor) {
		$("[data-target='" + seletor + "']").remove();
	}

	window.forceKeyboardNumeric = function(seletor) {
		$(seletor).on("focusin", function() {
			creteInputNumeric(seletor);
		});
	};

	window.mobileAndTabletcheck = function() {
	  var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	} 

	$(function() {
		$( document ).ajaxComplete(function() {
			if(mobileAndTabletcheck() == true){
				$(".number-mobile").each(function() {
					var seletor = "[name=" + $(this).attr("name") + "]";
					forceKeyboardNumeric(seletor);	
				});
			}
		});
	});
	
})(window);

(function(window){
	var FormatPdf = function() {
		var $scope = {};
		var $scopePrivate = {};

		$scopePrivate.init = function() {
			$scopePrivate.initVars();
			$scopePrivate.initFunctions();
			return $scope;
		}; 

		$scopePrivate.initVars = function() {
			$scopePrivate.TAG_INVALIDA = ["CAPTION"];
			$scopePrivate.SELETOR = {
				TEMPLATE_PDF : "#templatePdf",
				ID_TEMPLATE_PDF : "templatePdf"	
			};
			$scopePrivate.elementoPDF = null;
		}; 

		$scopePrivate.initFunctions = function() {
		
		};

		$scopePrivate.novoPdfTemplate = function() {
			var divTemplate = "<div id='containerTemplatePdf' class='hide'></div>";				
			$("#containerTemplatePdf").remove();                 
			$("body").append(divTemplate);
			$($scopePrivate.elementoPDF).attr("id", $scopePrivate.SELETOR.ID_TEMPLATE_PDF);
			$("#containerTemplatePdf").html($($scopePrivate.elementoPDF));
		};
         
		$scopePrivate.removeElementosInvalidos = function(){ 
			for(var i = 0; i < $scopePrivate.TAG_INVALIDA.length; i++){
				var tagInvalida = $scopePrivate.TAG_INVALIDA[i];
				$($scopePrivate.elementoPDF).find(tagInvalida).remove(); 
			}
		};

		$scope.formatToPdf = function(elemento) {
			$scopePrivate.elementoPDF = elemento;
			$scopePrivate.removeElementosInvalidos();
			$scopePrivate.novoPdfTemplate();
			return $scopePrivate.SELETOR.ID_TEMPLATE_PDF;
		};
         
		return $scopePrivate.init();
	};
 
	window.formatToPdf = function(elementoId) {
		var elementoClone = $("#" + elementoId).clone();
		var formatPdf = new FormatPdf();
		return formatPdf.formatToPdf(elementoClone);
	};
})(window);

$(function() {
	ItauJs.Exception();
	ItauJs.Print();
	ItauJs.DownloadManager();
	ItauJs.Search();
	ItauJs.Log();
	ItauJs.PDF();
});

$(document).on("focusin", ".invalido", function(){
	var obj = $(this);
	setTimeout(function(){
		obj.prev().show();
	},100);
});


/* ==============================================================================================
* browserAntigo: Janela de aviso de navegador antigo 
* 
* Descrição: Modifica o padding top do body e apresenta um banner no topo com uma mensagem e sugestões de browser para atualizar
*
* Data: 30 Jun 2016
*
* Dependencia js: jQuery 1.7 ou maior
*                 commons\html\inc-msg-browser-antigo.html
*
* Versao 1.0.5
*
* =============================================================================================== */
// variaveis que definem a versão minima de cada navegador
var browserMinIe = 9;       
var browserMinFirefox = 36;
var browserMinChrome = 40;
var browserMinOpera = 28; 
var browserMinSafari = 7; 

jQuery.browser = {};

var nAgt = navigator.userAgent;
jQuery.browser.ua = nAgt;

jQuery.browser.name  = navigator.appName;
jQuery.browser.fullVersion  = ''+parseFloat(navigator.appVersion);
jQuery.browser.majorVersion = parseInt(navigator.appVersion,10);
var nameOffset,verOffset,ix;

if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
    jQuery.browser.name = "Opera";
    jQuery.browser.fullVersion = nAgt.substring(verOffset+6);
    if ((verOffset=nAgt.indexOf("Version"))!=-1)
        jQuery.browser.fullVersion = nAgt.substring(verOffset+8);// In Opera, the true version is after "Opera" or after "Version"
}else if ( (verOffset=nAgt.indexOf("MSIE"))!=-1) {
    jQuery.browser.name = "Microsoft Internet Explorer";
    jQuery.browser.fullVersion = nAgt.substring(verOffset+5);// In MSIE < 11, the true version is after "MSIE" in userAgent
}else if (nAgt.indexOf("Trident")!=-1 ) {
    jQuery.browser.name = "Microsoft Internet Explorer";
    var start = nAgt.indexOf("rv:")+3;
    var end = start+4;
    jQuery.browser.fullVersion = nAgt.substring(start,end);// In TRIDENT (IE11) => 11, the true version is after "rv:" in userAgent
}else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
    jQuery.browser.name = "Chrome";
    jQuery.browser.fullVersion = nAgt.substring(verOffset+7);// In Chrome, the true version is after "Chrome"
}else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
    jQuery.browser.name = "Safari";
    jQuery.browser.fullVersion = nAgt.substring(verOffset+7);
    if ((verOffset=nAgt.indexOf("Version"))!=-1)
        jQuery.browser.fullVersion = nAgt.substring(verOffset+8);// In Safari, the true version is after "Safari" or after "Version"
}else if ((verOffset=nAgt.indexOf("AppleWebkit"))!=-1) {
    jQuery.browser.name = "Safari";
    jQuery.browser.fullVersion = nAgt.substring(verOffset+7);
    if ((verOffset=nAgt.indexOf("Version"))!=-1)
        jQuery.browser.fullVersion = nAgt.substring(verOffset+8);// In Safari, the true version is after "Safari" or after "Version"
}else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
    jQuery.browser.name = "Firefox";
    jQuery.browser.fullVersion = nAgt.substring(verOffset+8);// In Firefox, the true version is after "Firefox"
}else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ){
    jQuery.browser.name = nAgt.substring(nameOffset,verOffset);
    jQuery.browser.fullVersion = nAgt.substring(verOffset+1);
    if (jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()) {
        jQuery.browser.name = navigator.appName;
    }// In most other browsers, "name/version" is at the end of userAgent
}

// trim the fullVersion string at semicolon/space if present
if ((ix=jQuery.browser.fullVersion.indexOf(";"))!=-1){
    jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix);
}
if ((ix=jQuery.browser.fullVersion.indexOf(" "))!=-1){
    jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix);
}
jQuery.browser.majorVersion = parseInt(''+jQuery.browser.fullVersion,10);
if (isNaN(jQuery.browser.majorVersion)) {
    jQuery.browser.fullVersion  = ''+parseFloat(navigator.appVersion);
    jQuery.browser.majorVersion = parseInt(navigator.appVersion,10);
}
jQuery.browser.version = jQuery.browser.majorVersion;

var browserAntigoStatus = false;

if((jQuery.browser.name === "Microsoft Internet Explorer" && jQuery.browser.version < browserMinIe) || (jQuery.browser.name === "Firefox" && jQuery.browser.version < browserMinFirefox) ||(jQuery.browser.name === "Chrome" && jQuery.browser.version < browserMinChrome) || (jQuery.browser.name === "Opera" && jQuery.browser.version < browserMinOpera) || (jQuery.browser.name === "Safari" && jQuery.browser.version < browserMinSafari)){
    var incBannerMsg = "<div class='browser-antigo'>";
    incBannerMsg +=         "<div class='content'>";
    incBannerMsg +=             "<div class='content-msg'>";
    incBannerMsg +=                 "<p><strong>Atualize seu navegador para ter acesso a todos os recursos.</strong><br>Selecione uma das op&ccedil;&otilde;es ao lado.</p>";
    incBannerMsg +=             "</div>";
    incBannerMsg +=             "<div class='content-img'>";
    incBannerMsg +=                 "<ul id='links'>";
    incBannerMsg +=                     "<li><a href='https://www.itau.com.br/computador/' target='_blank'><span class='browser-btn-app-itau'></span></a></li>";
    incBannerMsg +=                     "<li><a href='http://windows.microsoft.com/pt-BR/internet-explorer/products/ie/home' target='_blank'><span class='browser-btn-ie'></span></a></li>";
    incBannerMsg +=                     "<li><a href='https://www.google.com/intl/pt-BR/chrome/browser/?hl=pt-br' target='_blank'><span class='browser-btn-chrome'></span></a></li>";
    incBannerMsg +=                     "<li><a href='http://www.mozilla.org/pt-BR/firefox/new/' target='_blank'><span class='browser-btn-firefox'></span></a></li>";
    incBannerMsg +=                     "<li><a href='http://www.apple.com/br/safari/' target='_blank'><span class='browser-btn-safari'></span></a></li>";
    incBannerMsg +=                 "</ul>";
    incBannerMsg +=             "</div>";
    incBannerMsg +=         "</div>";
    incBannerMsg +=     "</div>";
    browserAntigoStatus = true;
    setTimeout(function() {
        $('body:first').prepend(incBannerMsg);
        $('body').addClass('body-browser-antigo');
    },100);
}

//tratamento de console para IE9
if(window.console == undefined){
    window.console = {
        log : function(){},
        error : function(){},
        debug : function(){}
    };
};


$.navigator = {
   isIE : function(version){
       if(version != undefined && jQuery.browser.name == "Microsoft Internet Explorer" && version == jQuery.browser.version){
           return true;
       }else if(version == undefined && jQuery.browser.name == "Microsoft Internet Explorer"){
           return true;
       }
       return false;
   }
};

//tratamento para script carregado IE9
$.fn.scriptLoaded = function(fn){
    $(this).each(function(){
        if(typeof fn != "function"){
            return false;
        }else if($.navigator.isIE(9)){
            alert("ie 9")
            window.onload = fn;
        }else{
            $(this).load(fn);
        }
    });
};







(function($){
	
	/*console.log("jquery.itau.validacao - início carregamento script");*/

	$.validador = {};
	$.validador.fn = {}; // Agrupamento das funções de validação da biblioteca.
	$.validador.fn.condicoes = {};
	$.validador.util = {}; //Agrupamento de funções utilitárias

	/*
	 * Função responsável por atribuir as configurações padrões ou customizadas 
	 * da biblioteca de validação do formulário
	 */
	$.validador.setDefaults = function(settings) {

		$.validador.configuracao = {
			    debug: false
			  //, handler: function (validacoes) {
			  //	$.validador._debug("Execução do método handler padrão da biblioteca de validações");
			  //	$(this).validar();
			  //	$(this).submit();
			  //}
			  , formularios: {}
			  , mascaras: {
			  	  cpf: "000.000.000-00"
			  	, cnpj: "00.000.000/0000-00"
			  	, data: "00/00/0000"
			  	, dataHora: "00/00/0000 00:00"
			  	, hora: "00:00"
			  	, telefone:  "# 0000-0000"
			  	, celular: "# 0000-0000"
			  	, ddd: "(00)"
			  	, moeda: "###.###.###.###.##0,00"
			  	, cep: "00000-000"
			  	, percentual: "##0,00%"
			  }
			  , regraPadrao: {
  				  requerido: false
				, mascara: true
				, validcaoTipo: true
			  }
		};

		if(settings) $.extend(true, $.validador.configuracao, settings);

		$.validador._debug("Configuração - debug: " + this.configuracao.debug );

	};

	$.validador.util.formatar = function (aformatar, valores) {
		for (var i = 0; i < valores.length; ++i) {
			var valor = valores[i];
			var reg = new RegExp("\\{" + i + "\\}", "gm");             
			aformatar = aformatar.replace(reg, valor);
		}
		return aformatar;
	}

	$.validador._maxlen = function (regra) {
		if (regra.maxlen && !isNaN(regra.maxlen) && regra.maxlen > 0) {
			$(this).prop("maxlength", regra.maxlen);
		}
	};

	$.validador.fn._minlen = function (regra) {
		if (regra.minlen && !isNaN(regra.minlen) && regra.minlen > 0 && $(this).val() != "") {
			return ($(this).val().length >= regra.minlen);
		}
	};
	
	$.validador.fn._data = function (regra) {
		var dataValue = $(this).val(); 
		if (regra.data && dataValue !== "") {
			var dataMoment = moment(dataValue, "DD/MM/YYYY");
			return dataMoment.isValid();
		}
			return true;
		};  

	$.validador._mask = function (regra) {
		$.validador._debug("Mascara: " + $(this).attr("id") + " - início");

		if (regra.mascara) {

			$.validador._debug("Mascara: " + $(this).attr("id") + " - iniciando aplicação de máscara");
			
			if (!$(this).mask) {
				$.validador._debug("Mascara: " + $(this).attr("id") + " - Ausência de dependência jQuery.mask");
				return;
			}
			
			if(regra.cpf) {
				$.validador._debug("Mascara: " + $(this).attr("id") + " - $.validador.configuracao.mascaras.cpf: " + $.validador.configuracao.mascaras.cpf);
				$(this).mask($.validador.configuracao.mascaras.cpf);		
			} else if(regra.cnpj) {
				$(this).mask($.validador.configuracao.mascaras.cnpj);		
			} else if (regra.data) {
				$(this).mask($.validador.configuracao.mascaras.data);
			} else if (regra.moeda) {
				$(this).mask($.validador.configuracao.mascaras.moeda, {
					reverse: true
				});
			} else if (regra.telefone) {
				$(this).mask($.validador.configuracao.mascaras.telefone, {
					reverse: true
				});
			} else if (regra.celular) {
				$(this).mask($.validador.configuracao.mascaras.celular, {
					reverse: true
				});
			} else if (regra.ddd) {
				$(this).mask($.validador.configuracao.mascaras.ddd);
			} else if (regra.cep) {
				$(this).mask($.validador.configuracao.mascaras.cep);
			} else if (regra.percentual) {
				$(this).mask($.validador.configuracao.mascaras.percentual, {
					reverse: true
				});
			}
		}
		
		$.validador._debug("Mascara: " + $(this).attr("id") + " - Fim");
		
	};

	$.validador.fn._requerido = function (regra) {

		$.validador._debug("#" + $(this).attr("id") + ".regra.requerido: " + regra.requerido);
		if (regra.requerido) {
			if (!$(this).is(':disabled')) {
				var name = $(this).attr("name");
				if ($(this).is(":radio")) {	
					var required = $(this).data("requerido");
					if (required) { return $(this).is(":checked"); }
					else {
						var selector = 'input:radio[name="'+name+'"]';
						return $(selector).is(":checked");
					}
				} else if ($(this).is(":checkbox")) {
					return $(this).is(":checked");
				} else if ($(this).is("select")) {
					var invalidValue = $(this).data("valor-validacao");
					return ($(this).val() != invalidValue.toString());
				}
				else {
					var valor  = $(this).val();
					var regex = /\w/;
					return regex.test(valor);	
				}
			} 
		}
		return true;
	};
	
	$.validador.fn._grupo = function (regra) {

		var grupo = $(this).data("grupo");

		if ($(this).is(":text")) { 
			
			if (regra.grupo && grupo) {
				var valid = true;

				var filledCount = 0;
				$("input:text[data-grupo="+grupo+"]").each(function(){
					if ($(this).val() != "") { filledCount++; } 
				});
				if (filledCount == 0) { valid = false; }

				return valid;
			}
		}
		if ($(this).is(":checkbox")) {	
			var selector = "input:checkbox[data-grupo=" + grupo + "]";
			return $(selector).is(":checked");
		}
	};
	
	$.validador.fn._grupoLinha = function (regra) {

		var grupoLinha = $(this).data("grupo-linha");

		if (regra.grupoLinha && grupoLinha) {
			
			var valid = true;
			var oneFilled = false;
			$("input:text[data-grupo-linha="+grupoLinha+"]").each(function(){ 
				if ($(this).val() != "") { oneFilled = true; } 
			});
			if (oneFilled) {
				$("input:text[data-grupo-linha="+grupoLinha+"]").each(function(){ 
					if ($(this).val() == "") { valid = false; } 
				});
			}

			return valid;
		}
	};
	
	$.validador.fn._email = function (regra) {
		$.validador._debug("#" + $(this).attr("id") + ".regra.email: " + regra.email);

		if (regra.email && regra.validcaoTipo && $(this).val() != "") {
			var valor = $(this).val();
			var filtro = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			if(!filtro.test(valor)) return false;
		}

		return true;
	}

	$.validador.fn._cnpj = function (regra) {

		$.validador._debug("#" + $(this).attr("id") + ".regra.cnpj: " + regra.cnpj);

		if (regra.cnpj && regra.validcaoTipo && $(this).val() != "") {

			cnpj = $(this).val().replace(/[^\d]+/g,'');
			
			if(cnpj == '') return false;
			
			if (cnpj.length != 14)
				return false;
			
		    // Elimina CNPJs invalidos conhecidos
		    if (cnpj == "00000000000000" ||
		    	cnpj == "11111111111111" ||
		    	cnpj == "22222222222222" ||
		    	cnpj == "33333333333333" ||
		    	cnpj == "44444444444444" ||
		    	cnpj == "55555555555555" ||
		    	cnpj == "66666666666666" ||
		    	cnpj == "77777777777777" ||
		    	cnpj == "88888888888888" ||
		    	cnpj == "99999999999999")
		    return false;
		    
		    // Valida DVs
		    tamanho = cnpj.length - 2
		    numeros = cnpj.substring(0,tamanho);
		    digitos = cnpj.substring(tamanho);
		    soma = 0;
		    pos = tamanho - 7;
		    for (i = tamanho; i >= 1; i--) {
		    	soma += numeros.charAt(tamanho - i) * pos--;
		    	if (pos < 2)
		    		pos = 9;
		    }
		    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		    if (resultado != digitos.charAt(0))
		    	return false;
		    
		    tamanho = tamanho + 1;
		    numeros = cnpj.substring(0,tamanho);
		    soma = 0;
		    pos = tamanho - 7;
		    for (i = tamanho; i >= 1; i--) {
		    	soma += numeros.charAt(tamanho - i) * pos--;
		    	if (pos < 2)
		    		pos = 9;
		    }
		    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		    if (resultado != digitos.charAt(1))
		    	return false;

		}
	

		return true;
	};

	$.validador.fn._cpf = function (regra) {

		$.validador._debug("#" + $(this).attr("id") + ".regra.cpf: " + regra.cpf);

		if (regra.cpf && regra.validcaoTipo && $(this).val() != "") {

			var strCPF = $(this).val().replace(/\D/g,'');
			var Soma;
		    var Resto;
		    Soma = 0;
		 // Elimina CPFs invalidos conhecidos
			if (strCPF == "00000000000"  ||
				strCPF == "11111111111"  ||
				strCPF == "22222222222"  ||
				strCPF == "33333333333"  ||
				strCPF == "44444444444"  ||
				strCPF == "55555555555"  ||
				strCPF == "66666666666"  ||
				strCPF == "77777777777"  ||
				strCPF == "88888888888"  ||
				strCPF == "99999999999")
			return false;
		    
			for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
			Resto = (Soma * 10) % 11;
			
		    if ((Resto == 10) || (Resto == 11))  Resto = 0;
		    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
			
			Soma = 0;
		    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
		    Resto = (Soma * 10) % 11;
			
		    if ((Resto == 10) || (Resto == 11))  Resto = 0;
		    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;

	    }

	    return true;

	};

	$.validador.fn._digito = function (regra) {

		$.validador._debug("#" + $(this).attr("id") + ".regra.digito: " + regra.digito);
		
		if (regra.digito && $(this).val() != "") {
			var valor = $(this).val();
			if (valor != "") {
				$.validador._debug("valor do digito: '" + valor + "'");
				var regex = /^\d+$/;
				return regex.test(valor);
			}
		}

		return true;
	};

	$.validador.fn._moeda = function (regra) {

		$.validador._debug("#" + $(this).attr("id") + ".regra.moeda: " + regra.moeda);
		
		if (regra.monetario && $(this).val() != "") {
			var valor = $(this).val();
			$.validador._debug("valor do moeda: '" + valor + "'");
			var regex = /^\$?(([0-9][0-9]{0,3}(\.[0-9]{3})*)|[0-9]+)?,[0-9]{1,2}$/;
			return regex.test(valor);
		}

		return true;
	};
	
	$.validador.fn.condicoes.notin = function (premissa) {
		var atual = null;

		if (this.is(":radio")) {
			atual = $('input:radio[name="' + this.attr("id") + '"]:checked').val();
		} else {
			atual = this.val();
		}

		if (atual == undefined) return false;

		for (var valor in premissa.notin) {
			if ((valor == atual)) {
				return false;
			}
		}
		return true;
	}

	$.validador.fn.condicoes.cutomizado = function (premissa) {
		return premissa.cutomizado.call(this);
	}
	
	$.validador.fn.condicoes.visivel = function (premissa) {
		var status = $(this).is(":visible");
		return status == premissa.visivel;
	}

	$.validador.fn.condicoes.selecionado = function(premissa) {
		var name = $(this).attr("name");
		if ($(this).is(":radio")) {
			var selector = 'input:radio[name="'+name+'"]';
			return premissa.selecionado == $(selector).is(":checked");
		} else if ($(this).is(":checkbox")) {
			//var selector = "input:checkbox[name=" + name + "]" ;
			//return premissa.selecionado == $(selector).is(":checked");
			return premissa.selecionado == $(this).is(":checked");
		}
		return false;
	};

	$.validador.fn.condicoes.ne = function(premissa) {
		var valor1 = null;
		var valor2 = null;

		if (this.is(":radio")) {
			valor1 = $('input:radio[name="' + this.attr("id") + '"]:checked').val();
		} else {
			valor1 = this.val();
		}

		if ($(premissa.ne).length > 0) {
			valor2 = $(premissa.ne).val();	
		} else {
			valor2 = premissa.ne;
		}

		return (valor1 != valor2);
	};

	$.validador.fn.condicoes.eq = function(premissa) {

		var valor1 = null;
		var valor2 = null;

		if (this.is(":radio")) {
			valor1 = $('input:radio[name="' + this.attr("id") + '"]:checked').val();
		} else {
			valor1 = this.val();
		}


		if ($(premissa.eq).length > 0) {
			valor2 = $(premissa.eq).val();	
		} else {
			valor2 = premissa.eq;
		}

		return (valor1 == valor2);
	};

	$.validador.fn.condicoes.checked = function(premissa) {

		var valor1 = null;
		var valor2 = null;

		if (this.is(":radio")) {
			valor1 = $('input:radio[name="' + this.attr("id") + '"]:checked').val();
		} else {
			valor1 = this.val();
		}


		if ($(premissa.eq).length > 0) {
			valor2 = $(premissa.eq).val();	
		} else {
			valor2 = premissa.eq;
		}

		return (valor1 == valor2);
	};


	/*
 	 * Função responsável por realizar controlar a saida de depuração do script
	 */
	$.validador._debug = function (mensagem) {

		if ($.validador.configuracao.debug) {

			var saidalog = "[debug] " + mensagem;
			try {
				/*console.log(saidalog);*/
			} catch (e) {
				alert(saidalog);
			}
		}

	};

	

	/*
	 * Função responsável por salvar as configurações de validação do formulário
	 * e atribuir comportamentos de máscaramento de campos
	 */
	$.fn.validacao = function(configuracoes) {

		$.validador._debug("Identificação do formulário que está sendo processado: " + $(this).attr("id"));

		var formid = $(this).attr("id");
		var oform = this;
		var regras = {};

		if (configuracoes) $.extend(configuracoes.regras, regras);

		return this.each(function() {

			if (!configuracoes) return;

			for (var idcampo in configuracoes.regras) {

				var campo = $(this).find("#"+idcampo);
				
				if (!campo.attr("id")) {
					$.validador._debug("Tipo de elemento do id (#" + idcampo + "): " + campo.attr("id") + ". Ignorando campo");
					continue;
				}

				/*
				 * Aplica as regras padrão de configuração para os campos
				 * e.g.: Se todos obrigatóriamente tem máscara, se haverá validações por tipo etc.
				 */

				var tempConfig = {}; 
				$.extend(tempConfig, $.validador.configuracao.regraPadrao);
				$.extend(tempConfig, configuracoes.regras[idcampo]);
				$.extend(configuracoes.regras[idcampo], tempConfig);

				/* 
				 * Salva as configurações do elemento associado ao formulário
                 * e.g.: $.validador.configuracao.formularios.form1.campo1.requerido:true 
				 */

				if (!$.validador.configuracao.formularios[formid]) {
					$.validador.configuracao.formularios[formid] = {};
				}
				
				var formulario = $.validador.configuracao.formularios[formid];
				formulario[idcampo] = configuracoes.regras[idcampo];

				$.validador._debug("Chamando o método de aplicação de mascaras");
				$.validador._mask.call(campo, configuracoes.regras[idcampo]);
				
				$.validador._debug("Chamando o método de aplicação de quantidade máxima de caracteres");
				$.validador._maxlen.call(campo, configuracoes.regras[idcampo]);

				$.validador._debug("Realizando o bind da função de submit");

				//$(oform).bind("submit", function() {
				//	$.validador.configuracao.handler.call(oform, formulario);
				//});

			}

		});

	};

	$.fn.validar = function(callbacks) {

		$.validador._debug("$.fn.validar (" + formid + ") - início");

		var formid = $(this).attr("id");
		var formobj = this;

		return this.each(function() {

			var erros = [];
			var regras = $.validador.configuracao.formularios[formid];
			var resultadoPremissa = true;

			for (var campoid in regras) {
			
				$.validador._debug("$.fn.validar (" + formid + ") - campo que está sendo validado: " + campoid);
				var campo = $(formobj).find("#"+campoid);
				var regra = regras[campoid];

				if (regra.premissas) {
					for (var campoPremissa in regra.premissas) {

						if (!resultadoPremissa) break;

						$.validador._debug("$.fn.validar (" + formid + ") - campo premissa validacao: " + campoPremissa);
						var refCampoPremissa = $(this).find("#" + campoPremissa);
						if (refCampoPremissa == undefined) continue;

						$.validador._debug("$.fn.validar (" + formid + ") - premissa (" + campoPremissa + ") - campo encontrado");

						var premissas = regra.premissas[campoPremissa];

						for (var premissa in premissas) {

							$.validador._debug("$.fn.validar (" + formid + ") - premissa (" + campoPremissa + ") - função de validação de premissa: " + premissa);

							var funcaoPremssa = $.validador.fn.condicoes[premissa];
							if (funcaoPremssa == undefined) continue;

							$.validador._debug("$.fn.validar (" + formid + ") - premissa (" + campoPremissa + ") - (" + premissa + ") - encontrado");
							var resultadoPremissa = funcaoPremssa.call(refCampoPremissa, premissas);
							$.validador._debug("$.fn.validar (" + formid + ") - premissa (" + campoPremissa + ") - (" + premissa + ") - resultado: " + resultadoPremissa);
							if (!resultadoPremissa) break;

						}

					}

				}

				if (!resultadoPremissa)  {
					resultadoPremissa = true;
					continue;
				}

				for (var nome in regra) {
					
					$.validador._debug("$.fn.validar (" + formid + ") - (" + campoid + ") - função de validação que está sendo executada: " + nome);
					
					var nomefuncao = "_" + nome;
					
					var funcao = $.validador.fn[nomefuncao];
					
					if (funcao == undefined ) continue;
					
					var resultado = funcao.call(campo, regra);
					
					$.validador._debug("$.fn.validar (" + formid + ") - (" + campoid + ") - (" + nome + ") - Resultado da validação: " + resultado);
					
					if (!resultado) {
						var erro = {};						
						erro.id = campoid;
						erro[nome] = true;
						erros.push(erro);
						break;
					}
					
				}
				
			}
			
			$.validador._debug("$.fn.validar (" + formid + ") - Quantidade de campos invalidados: " + erros.length);
			
			if (callbacks.onerro && erros.length > 0) {
				$.validador._debug("$.fn.validar (" + formid + ") - executando callback onerro");
				callbacks.onerro.call(this, erros);
			} else if (callbacks.onsucesso && erros.length == 0) {
				$.validador._debug("$.fn.validar (" + formid + ") - executando callback onsucesso");
				callbacks.onsucesso.call(this);
			}
			
			$.validador._debug("$.fn.validar (" + formid + ") - fim");

		});
	};

	/*
	 *Inicializa o pluing de validações com a configuração padrão.
	 */
	$.validador.setDefaults();
	
	/*console.log("jquery.itau.validacao - fim carregamento script");*/

	return this;

})(jQuery);
(function($){
	
	$.comportamento = {};
	$.comportamento.fn = {};
	$.comportamento.fn.condicoes = {};
	$.comportamento.fn.acoes = {};
	$.comportamento.forms = {};

	/*
	 * Função responsável por atribuir as configurações padrões ou customizadas 
	 * da biblioteca de comportamentos do formulário
	 */
	$.comportamento.setDefaults = function(settings) {

		$.comportamento.configuracao = {
			  debug: false
			  , formularios: {}
		};

		if(settings) $.extend($.comportamento.configuracao, settings);

		this._debug("Configuração - debug: " + this.configuracao.debug );

	};

	/*
 	 * Função responsável por realizar controlar a saida de depuração do script
	 */
	$.comportamento._debug = function (mensagem) {

		if ($.comportamento.configuracao.debug) {

			var saidalog = "[debug] " + mensagem;
			try {
				console.log(saidalog);
			} catch (e) {
				alert(saidalog);
			}
		}

	};

	$.fn.comportamento = function(settings) {

		var idform = $(this).attr("id");

		if (!$.comportamento.forms[idform]) $.comportamento.forms[idform] = {};

		var formularios = $.comportamento.forms[idform];

		if (!settings || !settings.comportamentos) retrun;

		for (var idcampo in settings.comportamentos) {
			
			$.comportamento._debug("$.fn.comportamento - configurando comportamento do id: " + idcampo);
			
			if (idcampo == undefined) continue;

			var seletor = "#" + idcampo;

			if ($(this).find(seletor).is(":radio")) {
				seletor = "input:radio[name=" + idcampo + "]";
			}

			$.comportamento._debug("$.fn.comportamento - selector: " + seletor);
			
			var campo = $(this).find(seletor);
			
			formularios[idcampo] = settings.comportamentos[idcampo];
			
			
			$.comportamento._debug("$.fn.comportamento - atribuindo o evento : " + settings.comportamentos[idcampo].on + "; para o campo: " + idcampo);

			campo.each(function() {

				$(this).on(settings.comportamentos[idcampo].on, function(event) {
					$.comportamento.fn.avaliar.call(this, event, idform);
				});

			});


			
		}

	};

	$.comportamento.fn.avaliar = function (event, idform, index) {
		
		$.comportamento._debug("$.comportamento.fn.avaliar (" + $(this).attr("id") + ") - início");

		var comportamentos = $.comportamento.forms[idform];
		var campo = $(this);
		var comportamento = comportamentos[$(this).attr("id")];
		
		if (!comportamento || !comportamento.entao) return;
		
		$.comportamento._debug("$.comportamento.fn.avaliar (" + $(this).attr("id") + ") - comportamento validado");

		for (var nomeCondicao in comportamento) {

			var fnCondicao =  $.comportamento.fn.condicoes[nomeCondicao];

			if (fnCondicao == undefined) continue;

			$.comportamento._debug("$.comportamento.fn.avaliar (" + $(this).attr("id") + ") - condição de avaliação: " + nomeCondicao);
			
			var resultado = fnCondicao.call(campo, comportamento);

			$.comportamento._debug("$.comportamento.fn.avaliar (" + $(this).attr("id") + ") - condição de avaliação (" + nomeCondicao + "): " + resultado);
			
			for (var  idcampo in comportamento.entao) {

				var campoacao = $("#" + idcampo);

				if (campoacao.length == 0) return;

				$.comportamento._debug("$.comportamento.fn.avaliar (" + $(this).attr("id") + ") - ação campo (" + idcampo + ")");
				
				var listaacoes = comportamento.entao[idcampo];
				for (var nacao in listaacoes) {
					var fnAcao = $.comportamento.fn.acoes[nacao];
					if (fnAcao == undefined) continue;
					$.comportamento._debug("$.comportamento.fn.avaliar (" + $(this).attr("id") + ") - ação campo (" + idcampo + ") - funcao acao sobre campo (" + nacao + ") - início");
 					fnAcao.call(campoacao, resultado, listaacoes[nacao]);
 					$.comportamento._debug("$.comportamento.fn.avaliar (" + $(this).attr("id") + ") - ação campo (" + idcampo + ") - funcao acao sobre campo (" + nacao + ") - fim");
				}

			}

		}
		
		$.comportamento._debug("$.comportamento.fn.avaliar (" + $(this).attr("id") + ") - início");
	};

	$.comportamento.fn.condicoes.notin = function (comportamento) {
		var atual = null;

		if (this.is(":radio")) {
			atual = $("input:radio[name=" + this.attr("id") + "]:checked").val();
		} else {
			atual = this.val();
		}

		if (atual == undefined) return false;

		for (var x = 0; x < comportamento.notin.length; x++) {
			valor = comportamento.notin[x];
			$.comportamento._debug("	$.comportamento.fn.condicoes.notin (" + $(this).attr("id") + ") - valor: '" + valor + "' / atual: '" + atual + "'");
			if ((valor == atual)) {
				return false;
			}
		}
		return true;
	};

	$.comportamento.fn.condicoes.cutomizado = function (comportamento) {
		return comportamento.cutomizado.call(this);
	};

	$.comportamento.fn.condicoes.checked = function(comportamento) {
		var resultado = this.is(':checked');
		return resultado;
	};

	$.comportamento.fn.condicoes.ne = function(comportamento) {
		var valor1 = null;
		var valor2 = null;

		if (this.is(":radio")) {
			valor1 = $("input:radio[name=" + this.attr("id") + "]:checked").val();
		} else {
			valor1 = this.val();
		}

		if ($(comportamento.ne).length > 0) {
			valor2 = $(comportamento.ne).val();	
		} else {
			valor2 = comportamento.ne;
		}

		return (valor1 != valor2);
	};
	
	$.comportamento.fn.condicoes.eq = function(comportamento) {

		var valor1 = null;
		var valor2 = null;

		if (this.is(":radio")) {
			valor1 = $("input:radio[name=" + this.attr("id") + "]:checked").val();
		} else {
			valor1 = this.val();
		}


		if ($(comportamento.eq).length > 0) {
			valor2 = $(comportamento.eq).val();	
		} else {
			valor2 = comportamento.eq;
		}

		return (valor1 == valor2);
	};

	$.comportamento.fn.acoes.limpar = function (resultado, param) {
		if (resultado) {
			if (this.is(":radio")) {
				this.prop('checked', false);
			} else {
				this.val("");
			}
		}
	};

	$.comportamento.fn.acoes.habilitado = function (resultado, param) {
		var idcampo = this.attr("id");
		var ignorahabilitado = this.data("ignora-habilitado");
		if (ignorahabilitado == undefined) ignorahabilitado = false;
		
		if (!ignorahabilitado) {
		
			$.comportamento._debug("$.comportamento.fn.acoes.habilitado (" + idcampo + ") resultado (" + resultado + ") - parametro (" + param + ") - início");
			if (resultado) {
				this.prop( "disabled", !param);
			} else {
				this.prop( "disabled", param);
			}
			$.comportamento._debug("$.comportamento.fn.acoes.habilitado (" + idcampo + ") resultado (" + resultado + ") - parametro (" + param + ") - fim");
		
		}
		
	};

	$.comportamento.fn.acoes.mostrar = function (resultado, param) {
		if (resultado) {
			if (param) {
				this.show();
			} else {
				this.hide();
			}
		} else {
			if (param) {
				this.hide();
			} else {
				this.show();
			}
		}
	};

	$.comportamento.fn.acoes.trigger = function (resultado, param) {
		this.trigger(param);
	};

	$.comportamento.fn.acoes.nosFilhosHabilitados = function (resultado, param) {
		this.find("input, select").each(function () {
			var el = $(this);
			$.comportamento.fn.acoes.habilitado.call(el, resultado, param);	
		});
	};
	
	$.comportamento.fn.acoes.callback = function (resultado, param) {
		param.call(this, resultado);
	};
	
	$.comportamento.setDefaults();
})(jQuery);
/*!
 * Pikaday
 *
 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

/*!
 ***************************************************************************************************************************************
 *
 * ATENCAO - ESTE JAVASCRIPT FOI CUSTOMIZADO. SE FOR REALIZAR A ATUALIZAÇÃO DESTE JS, POR FAVOR SE ATENTAR EM REPLICAR A CUSTOMIZAÇÃO
 * TODA A CUSTOMIZACAO ESTÁ IDENTIFICADA PELO ID 20160218-CALENDARIO-PAGAMENTOS
 *
 ***************************************************************************************************************************************
 */ 

(function (root, factory)
{
    'use strict';

    var moment;
    if (typeof exports === 'object') {
        // CommonJS module
        // Load moment.js as an optional dependency
        try { moment = require('moment'); } catch (e) {}
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function (req)
        {
            // Load moment.js as an optional dependency
            var id = 'moment';
            moment = req.defined && req.defined(id) ? req(id) : undefined;
            return factory(moment);
        });
    } else {
        root.Pikaday = factory(root.moment);
    }
}(this, function (moment)
{
    'use strict';

    /**
     * feature detection and helper functions
     */
    var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },

    removeEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.detachEvent('on' + e, callback);
        }
    },

    fireEvent = function(el, eventName, data)
    {
        var ev;

        if (document.createEvent) {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, false);
            ev = extend(ev, data);
            el.dispatchEvent(ev);
        } else if (document.createEventObject) {
            ev = document.createEventObject();
            ev = extend(ev, data);
            el.fireEvent('on' + eventName, ev);
        }
    },

    trim = function(str)
    {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    },

    hasClass = function(el, cn)
    {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },

    addClass = function(el, cn)
    {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    },

    removeClass = function(el, cn)
    {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },

    isArray = function(obj)
    {
        return (/Array/).test(Object.prototype.toString.call(obj));
    },

    isDate = function(obj)
    {
        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    },

    isLeapYear = function(year)
    {
        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function(year, month)
    {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function(date)
    {
        if (isDate(date)) date.setHours(0,0,0,0);
    },

    compareDates = function(a,b)
    {
        // weak date comparison (use setToStartOfDay(date) to ensure correct result)
        return a.getTime() === b.getTime();
    },

    extend = function(to, from, overwrite)
    {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && typeof from[prop] === 'object' && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                }
                else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    },

    adjustCalendar = function(calendar) {
        if (calendar.month < 0) {
            calendar.year -= Math.ceil(Math.abs(calendar.month)/12);
            calendar.month += 12;
        }
        if (calendar.month > 11) {
            calendar.year += Math.floor(Math.abs(calendar.month)/12);
            calendar.month -= 12;
        }
        return calendar;
    },

    /**
     * defaults and localisation
     */
    defaults = {

        // bind the picker to a form field
        field: null,

        // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
        bound: undefined,

        // position of the datepicker, relative to the field (default to bottom & left)
        // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
        position: 'bottom left',

        // the default output format for `.toString()` and `field` value
        format: 'YYYY-MM-DD',

        // the initial date to view when first opened
        defaultDate: null,

        // make the `defaultDate` the initial selected value
        setDefaultDate: false,

        // first day of week (0: Sunday, 1: Monday etc)
        firstDay: 0,

        // the minimum/earliest date that can be selected
        minDate: null,
        // the maximum/latest date that can be selected
        maxDate: null,

        // number of years either side, or array of upper/lower range
        yearRange: 10,

        // used internally (don't config outside)
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,

        // 20160218-CALENDARIO-PAGAMENTOS
        // inclusão da opção de tratamento manual de maximo e minimo
        // se for 'false' o sistema irá manter o tratamento atual,
        // se for 'true' o sistema irá procurar o evento treatMaxManual e treatMinManual
        // exemplo: $(element).on("treatMaxManual", function(event){ tratamento para data max => event.originalEvent.maxDate e para minimo event.originalEvent.minDate });
        treatMaxMinManual: false,

        isRTL: false,

        // Additional text to append to the year in the calendar title
        yearSuffix: '',

        // Render the month after year in the calendar title
        showMonthAfterYear: false,

        // how many months are visible
        numberOfMonths: 1,

        // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
        // only used for the first display or when a selected date is not visible
        mainCalendar: 'left',

        // Specify a DOM element to render the calendar in
        container: undefined,

        // internationalization
        i18n: {
            previousMonth : 'Previous Month',
            nextMonth     : 'Next Month',
            months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
            weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        },

        // callback function
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null,

        // desabilita / habilita finais de semana
        desabilitaFDS: false
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function(opts, day, abbr)
    {
        day += opts.firstDay;
        while (day >= 7) {
            day -= 7;
        }
        return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function(d, m, y, isSelected, isToday, isDisabled, isEmpty)
    {
        if (isEmpty) {
            return '<td class="is-empty"></td>';
        }
        var arr = [];
        if (isDisabled) {
            arr.push('is-disabled');
        }
        if (isToday) {
            arr.push('is-today');
        }
        if (isSelected) {
            arr.push('is-selected');
        }
        return '<td data-day="' + d + '" class="' + arr.join(' ') + '">' +
                 '<a href="#eventos-carregar" class="pika-button pika-day" ' +
                    'data-pika-year="' + y + '" data-pika-month="' + m + '" data-pika-day="' + d + '">' + d + 
                        '<div class="circulo-is-today"></div>'+
                 '</a>' +
               '</td>';
    },

    renderRow = function(days, isRTL)
    {
        return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
    },

    renderBody = function(rows)
    {
        return '<tbody>' + rows.join('') + '</tbody>';
    },

    renderHead = function(opts)
    {
        var i, arr = [];
        for (i = 0; i < 7; i++) {
            arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
        }
        return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
    },

    renderTitle = function(instance, c, year, month, refYear)
    {
        var i, j, arr,
            opts = instance._o,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div class="pika-title">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

        for (arr = [], i = 0; i < 12; i++) {
            arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' +
                (i === month ? ' selected': '') +
                ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled' : '') + '>' +
                opts.i18n.months[i] + '</option>');
        }
        monthHtml = '<div class="pika-label-mes cursor-pointer">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month hidden nao-incluir-tabindex">' + arr.join('') + '</select></div>';

        if (isArray(opts.yearRange)) {
            i = opts.yearRange[0];
            j = opts.yearRange[1] + 1;
        } else {
            i = year - opts.yearRange;
            j = 1 + year + opts.yearRange;
        }

        for (arr = []; i < j && i <= opts.maxYear; i++) {
            if (i >= opts.minYear) {
                arr.push('<option value="' + i + '"' + (i === year ? ' selected': '') + '>' + (i) + '</option>');
            }
        }
        yearHtml = '<div class="pika-label-ano cursor-pointer">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year hidden nao-incluir-tabindex">' + arr.join('') + '</select></div>';

        if (opts.showMonthAfterYear) {
            html += yearHtml + monthHtml;
        } else {
            html += monthHtml + yearHtml;
        }

        if (isMinYear && (month === 0 || opts.minMonth >= month)) {
            prev = false;
        }

        if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
            next = false;
        }

        if (c === 0) {
            html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
        }
        if (c === (instance._o.numberOfMonths - 1) ) {
            html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
        }

        return html += '</div>';
    },

    renderTable = function(opts, data)
    {
        return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead(opts) + renderBody(data) + '</table>';
    },


    /**
     * Pikaday constructor
     */
    Pikaday = function(options)
    {
        var self = this,
            opts = self.config(options);

        self._onMouseDown = function(e)
        {
            if (!self._v) {
                return;
            }
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (!hasClass(target, 'is-disabled')) {
                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty')) {
                    self.setDate(new Date(target.getAttribute('data-pika-year'), target.getAttribute('data-pika-month'), target.getAttribute('data-pika-day')));
                    if (opts.bound) {
                        sto(function() {
                            self.hide();
                            if (opts.field) {
                                opts.field.blur();
                            }
                        }, 100);
                    }
                    return;
                }
                else if (hasClass(target, 'pika-prev')) {
                    self.prevMonth();
                    if( typeof clickPrev == 'function'){
                        clickPrev()
                    }
                }
                else if (hasClass(target, 'pika-next')) {
                    self.nextMonth();
                    if( typeof clickNext == 'function'){
                        clickNext()
                    }
                }
            }
            if (!hasClass(target, 'pika-select')) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                    return false;
                }
            } else {
                self._c = true;
            }
        };

        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }
            if (hasClass(target, 'pika-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (hasClass(target, 'pika-select-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onInputChange = function(e)
        {
            var date;

            if (e.firedBy === self) {
                return;
            }
            if (hasMoment) {
                date = moment(opts.field.value, opts.format);
                date = (date && date.isValid()) ? date.toDate() : null;
            }
            else {
                date = new Date(Date.parse(opts.field.value));
            }
            self.setDate(isDate(date) ? date : null);
            if (!self._v) {
                self.show();
            }
        };

        self._onInputFocus = function()
        {
            self.show();
        };

        self._onInputClick = function()
        {
            self.show();
        };

        self._onInputBlur = function()
        {
            if (!self._c) {
                self._b = sto(function() {
                    self.hide();
                }, 50);
            }
            self._c = false;
        };

        self._onClick = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'pika-select')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange);
                }
            }
            do {
                if (hasClass(pEl, 'pika-single')) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));
            if (self._v && target !== opts.trigger) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '');

        addEvent(self.el, 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);

        if (opts.field) {
            if (opts.container) {
                opts.container.appendChild(self.el);
            } else if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange);

            if (!opts.defaultDate) {
                if (hasMoment && opts.field.value) {
                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(opts.field.value));
                }
                opts.setDefaultDate = true;
            }
        }

        var defDate = opts.defaultDate;

        if (isDate(defDate)) {
            if (opts.setDefaultDate) {
                self.setDate(defDate, true);
            } else {
                self.gotoDate(defDate);
            }
        } else {
            self.gotoDate(new Date());
        }

        if (opts.bound) {
            this.hide();
            self.el.className += ' is-bound';
            addEvent(opts.trigger, 'click', self._onInputClick);
            addEvent(opts.trigger, 'focus', self._onInputFocus);
            addEvent(opts.trigger, 'blur', self._onInputBlur);
        } else {
            this.show();
        }
    };


    /**
     * public Pikaday API
     */
    Pikaday.prototype = {


        /**
         * configure functionality
         */
        config: function(options)
        {
            if (!this._o) {
                this._o = extend({}, defaults, true);
            }

            var opts = extend(this._o, options, true);

            opts.isRTL = !!opts.isRTL;

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

            var nom = parseInt(opts.numberOfMonths, 10) || 1;
            opts.numberOfMonths = nom > 4 ? 4 : nom;

            if (!isDate(opts.minDate)) {
                opts.minDate = false;
            }
            if (!isDate(opts.maxDate)) {
                opts.maxDate = false;
            }
            if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
                opts.maxDate = opts.minDate = false;
            }
            if (opts.minDate) {
                setToStartOfDay(opts.minDate);
                opts.minYear  = opts.minDate.getFullYear();
                opts.minMonth = opts.minDate.getMonth();
            }
            if (opts.maxDate) {
                setToStartOfDay(opts.maxDate);
                opts.maxYear  = opts.maxDate.getFullYear();
                opts.maxMonth = opts.maxDate.getMonth();
            }

            if (isArray(opts.yearRange)) {
                var fallback = new Date().getFullYear() - 10;
                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
            } else {
                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
                if (opts.yearRange > 100) {
                    opts.yearRange = 100;
                }
            }

            return opts;
        },

        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function(format)
        {
            return !isDate(this._d) ? '' : hasMoment ? moment(this._d).format(format || this._o.format) : this._d.toDateString();
        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function()
        {
            return hasMoment ? moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function(date, preventOnSelect)
        {
            if (hasMoment && moment.isMoment(date)) {
                this.setDate(date.toDate(), preventOnSelect);
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function()
        {
            return isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set propriedade para tratamento manual de minimo e maximo
         */
        // 20160218-CALENDARIO-PAGAMENTOS
        setTreatMaxMinManual : function(value)
        {
            if (!value && value != "true" && value != true) {
                value = false;
            }
            this._o.treatMaxMinManual = value;
        },

        /**
         * set the current selection
         */
        setDate: function(date, preventOnSelect)
        {
            if (!date) {
                this._d = null;
                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            //---- INICIO ------ 20160218-CALENDARIO-PAGAMENTOS
            if (this._o.treatMaxMinManual) {
                this._d = new Date(date.getTime());
                setToStartOfDay(this._d);
                this.gotoDate(this._d);
                if (isDate(min) && date < min) {
                    fireEvent(this._o.field, 'treatMinManual', {minDate:min});
                } else if (isDate(max) && date > max) {
                    fireEvent(this._o.field, 'treatMaxManual', {maxDate:max});
                }
            //---- FIM ------ 20160218-CALENDARIO-PAGAMENTOS
            } else {
                if (isDate(min) && date < min) {
                    date = min;
                } else if (isDate(max) && date > max) {
                    date = max;
                }
            }

            if (!this._o.treatMaxMinManual) { //20160218-CALENDARIO-PAGAMENTOS - realizar o gotoDate apenas quando nao for tratamento manual
                this._d = new Date(date.getTime());
                setToStartOfDay(this._d);
                this.gotoDate(this._d);
            }

            //---- INICIO ------ 20160218-CALENDARIO-PAGAMENTOS
            if (this._o.treatMaxMinManual) {
                fireEvent(this._o.field, 'treatMinMaxManual', {minDate:min, maxDate:max});
            }
            //---- FIM ------ 20160218-CALENDARIO-PAGAMENTOS

            if (this._o.field) {
                this._o.field.value = this.toString();
                fireEvent(this._o.field, 'change', { firedBy: this });
            }
            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this.getDate());
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function(date)
        {
            var newCalendar = true;

            if (!isDate(date)) {
                return;
            }

            if (this.calendars) {
                var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
                    lastVisibleDate = new Date(this.calendars[this.calendars.length-1].year, this.calendars[this.calendars.length-1].month, 1),
                    visibleDate = date.getTime();
                // get the end of the month
                lastVisibleDate.setMonth(lastVisibleDate.getMonth()+1);
                lastVisibleDate.setDate(lastVisibleDate.getDate()-1);
                newCalendar = (visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate);
            }

            if (newCalendar) {
                this.calendars = [{
                    month: date.getMonth(),
                    year: date.getFullYear()
                }];
                if (this._o.mainCalendar === 'right') {
                    this.calendars[0].month += 1 - this._o.numberOfMonths;
                }
            }

            //this.adjustCalendars();
            this.draw();
        },

        adjustCalendars: function() {
            this.calendars[0] = adjustCalendar(this.calendars[0]);
            for (var c = 1; c < this._o.numberOfMonths; c++) {
                this.calendars[c] = adjustCalendar({
                    month: this.calendars[0].month + c,
                    year: this.calendars[0].year
                });
            }
            this.draw();
        },

        gotoToday: function()
        {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function(month)
        {
            if (!isNaN(month)) {
                this.calendars[0].month = parseInt(month, 10);
                this.adjustCalendars();
            }
        },

        nextMonth: function()
        {
            this.calendars[0].month++;
            this.adjustCalendars();
        },

        prevMonth: function()
        {
            this.calendars[0].month--;
            this.adjustCalendars();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function(year)
        {
            if (!isNaN(year)) {
                this.calendars[0].year = parseInt(year, 10);
                this.adjustCalendars();
            }
        },

        /**
         * change the minDate
         */
        setMinDate: function(value)
        {
            this._o.minDate = value;
        },

        /**
         * change the maxDate
         */
        setMaxDate: function(value)
        {
            this._o.maxDate = value;
        },

        /**
         * refresh the HTML
         */
        draw: function(force)
        {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth,
                html = '';

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            for (var c = 0; c < opts.numberOfMonths; c++) {
                html += '<div class="pika-lendar">' + renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year) + this.render(this.calendars[c].year, this.calendars[c].month) + '</div>';
            }

            this.el.innerHTML = html;

            if (opts.bound) {
                if(opts.field.type !== 'hidden') {
                    sto(function() {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            if (typeof this._o.onDraw === 'function') {
                var self = this;
                sto(function() {
                    self._o.onDraw.call(self);
                }, 0);
            }
        },

        adjustPosition: function()
        {
            if (this._o.container) return;
            var field = this._o.trigger, pEl = field,
            width = this.el.offsetWidth, height = this.el.offsetHeight,
            viewportWidth = window.innerWidth || document.documentElement.clientWidth,
            viewportHeight = window.innerHeight || document.documentElement.clientHeight,
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
            left, top, clientRect;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top  = pEl.offsetTop + pEl.offsetHeight;
                while((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top  += pEl.offsetTop;
                }
            }

            // default position is bottom & left
            if (left + width > viewportWidth ||
                (
                    this._o.position.indexOf('right') > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
                left = left - width + field.offsetWidth;
            }
            if (top + height > viewportHeight + scrollTop ||
                (
                    this._o.position.indexOf('top') > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
                top = top - height - field.offsetHeight;
            }
            this.el.style.cssText = [
                'position: absolute',
                'left: ' + left + 'px',
                'top: ' + top + 'px'
            ].join(';');
        },

        /**
         * render HTML for a particular month
         */
        render: function(year, month)
        {
            var opts   = this._o,
                now    = new Date(),
                days   = getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data   = [],
                row    = [];
            setToStartOfDay(now);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var cells = days + before,
                after = cells;
            while(after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            for (var i = 0, r = 0; i < cells; i++)
            {
                var day = new Date(year, month, 1 + (i - before)),
                    isDisabled = (opts.minDate && day < opts.minDate) || (opts.maxDate && day > opts.maxDate),
                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                    isToday = compareDates(day, now),
                    isEmpty = i < before || i >= (days + before);

		// desabilita se for fim de semana
                if( opts.desabilitaFDS ) 
                    if( day.getDay() === 0 || day.getDay() === 6 )
                        isDisabled = true;

                row.push(renderDay(1 + (i - before), month, year, isSelected, isToday, isDisabled, isEmpty));

                if (++r === 7) {
                    data.push(renderRow(row, opts.isRTL));
                    row = [];
                    r = 0;
                }
            }
            return renderTable(opts, data);
        },

        isVisible: function()
        {
            return this._v;
        },

        show: function()
        {
            if (!this._v) {
                removeClass(this.el, 'is-hidden');
                this._v = true;
                this.draw();
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                    this.adjustPosition();
                }
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function()
        {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.cssText = '';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if (v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        /**
         * GAME OVER
         */
        destroy: function()
        {
            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            if (this._o.field) {
                removeEvent(this._o.field, 'change', this._onInputChange);
                if (this._o.bound) {
                    removeEvent(this._o.trigger, 'click', this._onInputClick);
                    removeEvent(this._o.trigger, 'focus', this._onInputFocus);
                    removeEvent(this._o.trigger, 'blur', this._onInputBlur);
                }
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }

    };

    return Pikaday;

}));

/*!
 * Pikaday jQuery plugin.
 *
 * Copyright © 2013 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

(function (root, factory)
{
    'use strict';

    if (typeof exports === 'object') {
        // CommonJS module
        factory(require('jquery'), require('../pikaday'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'pikaday'], factory);
    } else {
        // Browser globals
        factory(root.jQuery, root.Pikaday);
    }
}(this, function ($, Pikaday)
{
    'use strict';

    $.fn.pikaday = function()
    {
        var args = arguments;

        if (!args || !args.length) {
            args = [{ }];
        }

        return this.each(function()
        {
            var self   = $(this),
                plugin = self.data('pikaday');

            if (!(plugin instanceof Pikaday)) {
                if (typeof args[0] === 'object') {
                    var options = $.extend({}, args[0]);
                    options.field = self[0];
                    self.data('pikaday', new Pikaday(options));
                }
            } else {
                if (typeof args[0] === 'string' && typeof plugin[args[0]] === 'function') {
                    plugin[args[0]].apply(plugin, Array.prototype.slice.call(args,1));

                    if (args[0] === 'destroy') {
                        self.removeData('pikaday');
                    }
                }
            }
        });
    };

}));

/* ==============================================================================================
* AUTOTAB
* 
*
* Data: 30 Jun 2016
*
* 
* Versao 1.0.2
*
* =============================================================================================== */
var timeOutAutoTab = 500;
var iniciaAutotab = function(){
    $('.autotab').on({
        keydown: function(event){
            indiceAutoTab = $('.autotab').index(this);
            campoAtual = $('.autotab')[indiceAutoTab];
            maxLenInput = $(campoAtual).attr('maxlength');
            campoAnterior = $('.autotab')[indiceAutoTab -1];
            campoSeguinte =  $('.autotab')[indiceAutoTab +1];
            tecla=(window.event)?event.keyCode:event.which;
        },
        keyup: function(event){
            lenInput =  $(campoAtual).val().length;
            // timeout para esperar a mascara ser aplicada antes da troca de campo
            setTimeout(function(){
                if(lenInput >= maxLenInput){
                    campoSeguinte.focus();
                }
            },timeOutAutoTab);
        }
    });
}



function abrirSecao(section){
	if($('#secao-' + section).hasClass('fechado')){
		$('#secao-' + section).removeClass("aberto");
	}
	$('#conteudo-secao-' + section).show();
	fecharOutrasAbas(section);
}

function fecharOutrasAbas(abaClicada){
	for(var i = 1; i <= 6; i++){
		if(i != abaClicada){
			$('#secao-' + i).addClass("fechado");
			$('#conteudo-secao-' + i).hide();			
		}
	}
}

function jsonSubmit(url, form, obj) {

		var jsonResponse = null;
		var parameter = null;
		
		if (form != null && form != "") {			
			var disabled = $('#' + form).find(':input:disabled').removeAttr('disabled'); // É necessario habilitar todos os campos antes de passar com o Json.
			//paramiter = JSON.stringify($('#' + form).serializeObject());
			parameter = serializeObject($('#' + form));			
			disabled.attr('disabled', 'disabled'); // Desabilita todos os campos que form habilitados anteriormente.
		}else if(obj != null && obj != ""){
			parameter = JSON.stringify(obj);
		}
		
		$.ajax({
			async : false,
			data : parameter,
			type : 'POST',
			contentType : 'application/json',
			url : url
		}).done(function(response) {
			jsonResponse = response;
		});

		return jsonResponse;

	}

function ajaxSubmit(url, form, obj) {

	var jsonResponse = null;
	var parameter = null;
	
	if (form != null && form != "") {			
		var disabled = $('#' + form).find(':input:disabled').removeAttr('disabled'); // É necessario habilitar todos os campos antes de passar com o Json.
		//paramiter = JSON.stringify($('#' + form).serializeObject());
		parameter = $('#' + form).serialize();			
		disabled.attr('disabled', 'disabled'); // Desabilita todos os campos que form habilitados anteriormente.
	}else if(obj != null && obj != ""){
		parameter = JSON.stringify(obj);
	}
	
	$.ajax({
		async : false,
		data : parameter,
		type : 'POST',
		contentType : 'application/json',
		datatype: 'html',
		url : url
	}).done(function(response) {
		jsonResponse = response;
	});

	return jsonResponse;

}

//Serializa o objeto OBS: Arrumar Lógica.
function serializeObject(form) {	
		
	var noList = "";		
	var list = "";
	var pColumn = null;
	var result = "";
	var a = form.serializeArray();
	
	$.each(a, function() {	
		if(this.name.indexOf(".") < 0){	
			noList += "\"" + this.name + "\" : \"" + this.value + "\",";					
		}
	});

	noList = noList.substring(0, noList.length -1);
	
	$.each(a, function() {				
		if(this.name.indexOf(".") >= 0){	
			var name = "";
			var spl = this.name.split(".");
			
			//if(spl.length == 2){
				name = spl[1];
//						}else if(spl.length > 2){
//							name = this.name.replace(spl[0] + ".", "");	
//						}
					
			if(pColumn == null){
				pColumn = this.name;
				list += "{\"" + name + "\" : \"" + this.value + "\",";	
			}else{
				if(pColumn == this.name){
					list = list.substring(0, list.length -1);
					list += "},{\"" + name + "\" : \"" + this.value + "\",";
				}else{
					list += " \"" + name  + "\" : \"" + this.value + "\",";
				}
			}			
			result = ",\"" + spl[0] + "\" : [" + list.substring(0, list.length -1) + "}]";												
		}			
	});
	var strObj = "{" + noList + result + "}";					
	return strObj;
};

/*
 * OBS: Revias função - esta função nào é a original do projeto
  Pra que serve: 
  Como usar: 
  Retorno:
*/
function isCpf(strCPF) {
    var soma;
    var resto;
    soma = 0;
    var i = 1;
    var x = 1;

    strCPF = strCPF.replace(".", "").replace(".", "").replace("-", "");
    
	if (strCPF == "00000000000" || strCPF == "11111111111" || strCPF == "22222222222" || strCPF == "33333333333" || 
		strCPF == "44444444444" || strCPF == "55555555555" || strCPF == "66666666666" || strCPF == "77777777777" || 
		strCPF == "88888888888" || strCPF == "99999999999"){
		alert("Cpf invalido!");
		return false;
	}
    
	for (i=1; i<=9; i++){soma = soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);}
	resto = (soma * 10) % 11;
	
    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(strCPF.substring(9, 10))){ 
    	alert("Cpf invalido!");
    	return false;
    }
	
	soma = 0;
    for (x=1; x<=10; x++){soma = soma + parseInt(strCPF.substring(x-1, x)) * (12 - x);}
    resto = (soma * 10) % 11;
	
    if ((resto == 10) || (resto == 11)){resto = 0;}
    if (resto != parseInt(strCPF.substring(10, 11))){
    	alert("Cpf invalido!");
    	return false;
    }
    
    return true;
    
}

/*
  Pra que serve: 
  Como usar: 
  Retorno:
*/
function mascara_tel(campo, e){
	var tecla = e.keyCode;
	if(tecla != 9){
		if(campo.value.length == 4 && tecla != 8 && tecla != 0 && tecla != 44 && tecla != 46){
			campo.value = campo.value  + '-';
		}else if(campo.value.length == 9 && tecla != 8 && tecla != 0 && tecla != 44 && tecla != 46){
			campo.value = campo.value.substr(0,4) + campo.value.substr(5,1) + '-' + campo.value.substr(6,3);
		}
		if(campo.value.length == 10 && tecla == 8){
			campo.value = campo.value.substr(0,4) + '-' + campo.value.substr(4,1) + campo.value.substr(6,4);
		}
	}
}

/*
  Pra que serve: 
  Como usar: 
  Retorno:
*/
function emailValido(email){
	var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
        if(typeof(email) == "string"){
                if(er.test(email)){ return true; }
        }else if(typeof(email) == "object"){
                if(er.test(email.value)){
                    return true;
                }
        }else{
                return false;
        }
}

function telefoneValido(Fone){
	if((Fone.value.length < 8) || (Fone.value.length > 9)){
		return false;
	}else{
		return true;
	}
}

/*
  Pra que serve: 
  Como usar: 
  Retorno:
*/
function moeda(z){
	v = z.value;
	v = v.replace(/\D/g,"");
	v = v.replace(/(\d{1})(\d{8})$/,"$1.$2");
	v = v.replace(/(\d{1})(\d{5})$/,"$1.$2");
	v = v.replace(/(\d{1})(\d{1,2})$/,"$1,$2");
	z.value = v;
}

/*
  Pra que serve: 
  Como usar: 
  Retorno:
*/
function exibeAjuda(ind, campo, msg){
	var posicaoOriginal = campo;
	for(var posX=0, posY=0; campo; campo=campo.offsetParent){
		posX += campo.offsetLeft;
		posY += campo.offsetTop;
		if(campo != posicaoOriginal && campo!= document.body && campo != document.documentElement){
			posX -= campo.scrollLeft;
			posY -= campo.scrollTop;
		}
	}
	posY = posY - 100;
	posX = posX - 300;
	
	if(ind == 1){
		alert(msg);
	}
}

/*
  Pra que serve: Mascara para valor monetário Brasileiro.
  Como usar: onkeypress="return formata_Reais(this, '.', ',', event);"
  Retorno: 0.000,00
*/
function formata_Reais(fld, milSep, decSep, e){
	var sep = 0;
	var key = '';
	var i = j = 0;
	var len = len2 = 0;
	var strCheck = '0123456789';
	var aux = aux2 = '';
	var whichCode = e.keyCode ? e.keyCode :
					e.charCode ? e.charCode :
					e.which	? e.which :
					void 0;
	if(fld.value.length < fld.maxLength){
		if(whichCode == 13 || whichCode == 8 || whichCode == 0) return true;
		key = String.fromCharCode(whichCode); //Valor para o código da Chave
		if (strCheck.indexOf(key) == -1) return false; // chave invalida
		len = fld.value.length;
		for(i = 0; i < len; i++)
		if((fld.value.charAt(i) != '0') && (fld.value.charAt(i) != decSep)) break;
		aux = '';
		for(; i < len; i++)
		if (strCheck.indexOf(fld.value.charAt(i))!=-1) aux += fld.value.charAt(i);
		aux += key;
		len = aux.length;
		if (len == 0) fld.value = '';
		if (len == 1) fld.value = '0' + decSep + '0' + aux;
		if (len == 2) fld.value = '0' + decSep + aux;
		if (len > 2){
			aux2 = '';
			for (j = 0, i = len - 3; i>=0; i--){
				if(j == 3){
					aux2 += milSep;
					j = 0;
				}
				aux2 += aux.charAt(i);
				j++;
			}
			fld.value = '';
			len2 = aux2.length;
			for(i = len2 - 1; i >= 0; i--)
			fld.value += aux2.charAt(i);
			fld.value += decSep + aux.substr(len - 2, len);
		}
		return false;
	}
}

/*
  Pra que serve: Verifica o Cep esta no formato correto.
  Como usar: cepPreenchidoCorreto('011110-400');
  Retorno:
*/
function cepPreenchidoCorreto(cep){
	if((cep.value.length != 9) || (cep.value.length == '00000-000')) {
		return false;
	}else{
		return true;
	}
}

/*
  Pra que serve: Verifica a igualdade emtre dois Ceps.
  Como usar: resetForm('formFormularioImovel');
  Retorno:
*/
function consisteCEP(cep1, cep2){
	var ret = true;
	if(cep2 != ""){
		if(cep1 != cep2){
			ret = false;
		}
	}
	return ret;
}

/*
  Pra que serve: Limpa todos os compos de um formulario
  Como usar: resetForm('formFormularioImovel');
  Retorno:
*/
function resetForm(form){
   $(":text,:radio,:checkbox", $("#" + form)).each(function () {		   
     $(this).val("");
     $(this).prop({ checked: false });
 });
}

/*
  Pra que serve: mascara de data
  Como usar: onkeyup="mascara_data(this,event);"
  Retorno: mascara de data no formato dd/mm/aaaa
*/
function mascara_data(campo, e){
	var tecla = e.keyCode;
	if(campo.value.length == 2 && tecla != 8 && tecla != 0 && tecla != 44 && tecla != 46){
		campo.value = campo.value  + '/';
	}else if(campo.value.length == 5 && tecla != 8 && tecla != 0 && tecla != 44 && tecla != 46){
		campo.value = campo.value  + '/';
	}
}

/*
  Pra que serve: mascara de cpf
  Como usar: onkeydown="mascara_cpf(this, event);"
  Retorno: mascara de cpf no formato xxx.xxx.xxx-xx
*/
function mascara_cpf(Campo, teclapres){
	var tecla = teclapres.keyCode;

	if(tecla != 9 && tecla != 8 && tecla != 46 && tecla != 37 && tecla != 39){
		Campo.value = numberFilter(Campo.value, 0);
		var vr = new String(Campo.value);
		vr = numberFilter(vr, 12);
		if(vr.length > 11){
			vr = vr.substring(1, 12);
		}
		tam = vr.length;
		if (tam > 0 && tam <= 3)
			Campo.value = vr.substr(0, tam);
		if (tam > 3 && tam < 7)
			Campo.value = vr.substr(0, 3) + '.' + vr.substr(3, tam);
		if (tam >= 7 && tam < 10)
			Campo.value = vr.substr(0, 3) + '.' + vr.substr(3, 3) + '.' + vr.substr(6, tam);
		if (tam >= 10 && tam < 12)
			Campo.value = vr.substr(0, 3) + '.' + vr.substr(3, 3) + '.' + vr.substr(6, 3) + '-' + vr.substr(9, tam-9);
	}
}

/*
  Pra que serve: mascara de cnpj
  Como usar: onkeydown="mascara_CNPJ(this, event);"
  Retorno: mascara de cnpj no formato xx.xxx.xxx/xxxx-xx
*/
function mascara_CNPJ(Campo, teclapres){
	if(window.event){
		var tecla = teclapres.keyCode;
	}else tecla = teclapres.which;
		var vr = new String(Campo.value);
		vr = vr.replace(".","");
		vr = vr.replace(".","");
		vr = vr.replace("/","");
		vr = vr.replace("-","");
		tam = vr.length + 1;
		if(tecla != 9 && tecla != 8){
			if (tam > 2 && tam <= 6)
				Campo.value = vr.substr(0, 2) + '.' + vr.substr(2, tam);
			if (tam > 6 && tam < 9)
				Campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) + '.' + vr.substr(5, tam-5);
			if (tam >= 9 && tam < 13)
				Campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) +  '.' + vr.substr(5, 3) +  '/' + vr.substr(8, tam-8);
			if (tam >= 13 && tam < 15)
				Campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) +  '.' + vr.substr(5, 3) +  '/' + vr.substr(8, 4) +  '-' + vr.substr(12, tam-12);
		}
}

/*
   Pra que serve: verificar de o que foi digitado é numero
   Como usar: onkeypress="return somenteNumeros(event);"
   Retorno: true ou false
*/
function soNumero(){}

function somenteNumeros(e){
	var tecla=(window.event)?event.keyCode:e.which;
	if ((tecla > 47 && tecla <58)) return true;
	else{
		if((tecla == 8) || (tecla == 0)){
			return true;
		}else{
			return false;
		}
	}
}

/*
   Pra que serve: mascar de cep no formato xxxxx-xxx
   Como usar: onkeydown="formataCEP(this.value,this.id);"
   Retorno: string com cep formatado
*/
function formataCEP(valor,campo){
	valor=valor.replace(/\D/g,"");
	CepValidado= valor;
	valor= valor.replace(/^(\d{5})(\d)/,"$1-$2");
	document.getElementById(campo).value=valor;
}

/*
   Pra que serve: verificar se data é válida
   Como usar: checkDate(this);"
   Retorno: true ou false
*/
// ERRO NO data.match
function checkDate(data){
	return true;
}
function checkDate2(data){
	var expReg = /^((0[1-9]|[12]\d)(0[1-9]|1[0-2])|30(0[13-9]|1[0-2])|31(0[13578]|1[02]))(19|20)?\d{2}$/;
	var aRet = true;
	if((data.match(expReg)) && (data != '')){
		var dia = data.substring(0,2);
		var mes = data.substring(2,4);
		var ano = data.substring(4,8);
		
		if((mes == 4 || mes == 6 || mes == 9 || mes == 11) && (dia > 30)){
			aRet = false;
		}else{
			if((ano % 4) != 0 && mes == 2 && dia > 28){
				aRet = false;
			}else{
				if((ano%4) == 0 && mes == 2 && dia > 29){
					aRet = false;
				}
			}
		}
		dataInvalida = 0;
	}else{
		dataInvalida = 1;
	}
}

/* 
 * FALTA IMPLEMENTÇÃO
 * */
function formataCPF(valor){	
	 valor=valor.replace(/\D/g,""); //Remove tudo o que não é dígito
	 valor=valor.replace(/(\d{3})(\d)/,"$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
	 valor=valor.replace(/(\d{3})(\d)/,"$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
	 //de novo (para o segundo bloco de números)
	 valor=valor.replace(/(\d{3})(\d{1,2})$/,"$1-$2"); //Coloca um hífen entre o terceiro e o quarto dígitos
	 return valor;
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function formataData(valor)
{
	valor = valor.replace(/\D/g,"");
	DataValidado=valor;
	valor = valor.replace(/^(\d{2})(\d)/,"$1/$2");
	valor = valor.replace(/(\d{2})(\d)/,"$1/$2");
	document.getElementById('dataNascimento').value= valor;
}

/*
	Excluir valores não numéricos dos campos input
*/
function apenasNumeros(e){
	var tecla=(window.event)?event.keyCode:e.which;
	if ($.inArray(tecla, [46, 8, 9, 27, 13, 110]) !== -1
		|| // Allow: Ctrl+A
		(tecla == 65 && e.ctrlKey === true)
		|| // Allow: Ctrl+C
		(tecla == 67 && e.ctrlKey === true)
		|| // Allow: Ctrl+X
		(tecla == 88 && e.ctrlKey === true)
		|| // Allow: home, end, left, right
		(tecla >= 35 && e.keyCode <= 39)
		) {
		// let it happen, don't do anything
		return;
	}
	var val = $(this).val().replace(/([^0-9])/g,"");
	$(this).val(val);
}

/* ==============================================================================================
* switchElements: Executa a troca de estado de um ou mais elementos
* 
* Descrição: Executa a troca de estado de um ou mais elementos
*
* Autor: Itau-Unibanco
*
* Data: 05 Fev 2015
*
* Exemplo de uso: SwitchElements.init();
*
* Dependencia js: jQuery 1.7 ou maior, 
*
* Dependencia CSS: 
* 
* Versao 1.0.0
*
* =============================================================================================== */
var SwitchElements = {
    thisClass : this,
	init : function () {
		thisClass = this;
		
    	var elementosExec = $("[class*=switchElementsExec]")
    	$.each(elementosExec,function (index) {
    		if ($(elementosExec[index]).is("input:radio")||
    				$(elementosExec[index]).is("select") || 
    				    $(elementosExec[index]).is("input:checkbox")) {
    			$(elementosExec[index]).unbind( "change" );
    			$(elementosExec[index]).change(function () {
    				thisClass.switchElements(this);
    			});
    		}
    		else if ($(elementosExec[index]).is("input:button") || 
    				$(elementosExec[index]).is("button") ||
    				$(elementosExec[index]).is("td") ||
    					$(elementosExec[index]).is("a:link")) {
    			$(elementosExec[index]).unbind( "click" );
    			$(elementosExec[index]).click(function () {
    				thisClass.switchElements(this);
    			});
    		} 	
        });
	},
	switchElements : function (obj) {
		var className = $(obj).attr('class');
		var classNameSubElement = '.switchElementsInner';
		if (className.indexOf ("switchElementsExec") >= 0) {
			var sAux = className.substring(className.indexOf ("switchElementsExec"));
			if (sAux.indexOf(" ") >= 0) {
				sAux = sAux.substring (0, sAux.indexOf(" ")); 
			}
			if (sAux.indexOf("_") >= 0) {
				classNameSubElement = classNameSubElement + sAux.substring(sAux.indexOf("_"), sAux.length);
			}
		}
		var elementos = $(obj).closest('.switchElementsOuter').find(classNameSubElement).children();
		var index;
		var objsCurrentShow = $(obj).closest('.switchElementsOuter').find(classNameSubElement +":visible").children(":visible");
		$.each(elementos,function (index) {
				$(elementos[index]).show();	
		});
		$.each(objsCurrentShow,function (index) {
			$(objsCurrentShow[index]).hide();	
		});
	}
}
function inicializaSelectsChosen () {
	if ($('.chosen-select').closest('div').is('.fake-select')) {
		$('.chosen-select').prev("span").remove();
		$('.chosen-select').unwrap();
	};
	$('.chosen-select').chosen ({width:"100%", no_results_text: "Registro não encontrado"});
}

/**
 * Plugin da jquery responsavel por usar o tablesorter nas paginas
 * 
 * 
 * Uso:
 * 
 * $("#tabelaQueDesejoAdicionarOTableSorter").itauTableSorter({ tema:
 * "personnaliteMais" });
 * 
 * @author Deivid Martins
 * 
 * 
 * @param $
 */

(function($) {

	$.fn.itauTableSorter = function(opcoes) {
		var thisElement = $(this);
		
		if(opcoes.urlAjax) {
			opcoes.urlAjax = opcoes.urlAjax + "{page}/{size}/{sortList:column}";
		}

		initTableSorter(opcoes.urlAjax, 
				opcoes.tamanhoPaginacao,
				thisElement.selector,
				opcoes.idElementoPaginacao,
				opcoes.mensagemParaTabelaVazia);
	};

	/**
	 * Chama tableSorter e tableSorterPager definindo varios parametros como default que teriam que ser passados pelo desenvolvedor
	 */
	var initTableSorter = function(ajaxUrl, paginationSize, element, paginationElement, noDataMessage) {
		var $table = $(element),
	    $pager = $('#' + paginationElement);

		$.tablesorter.customPagerControls({
			table          : $table,                   // point at correct table (string or jQuery object)
		    pager          : $pager,                   // pager wrapper (string or jQuery object)
		    pageSize       : '.left a',                // container for page sizes
		    currentPage    : '.right a',               // container for page selectors
		    ends           : 2,                        // number of pages to show of either end
		    aroundCurrent  : 2,                        // number of pages surrounding the current page
		    link           : '<li><a data-page="{page}" class="anyItauTableSorter">{page}</a></li>', // page element; use {page} to include the page number
		    currentClass   : 'ativo',                // current page class name
		    adjacentSpacer : ' | ',                    // spacer for page numbers next to each other
		    distanceSpacer : ' &#133; ',               // spacer for page numbers away from each other (ellipsis &hellip;)
		    addKeyboard    : true                      // add left/right keyboard arrows to change current page
		});
		
	  	$table.tablesorter({
			theme : 'blue',
			widthFixed: true
		})

		.tablesorterPager({

			container : $pager,
			ajaxUrl : ajaxUrl,
			ajaxObject : {
				dataType : 'json'
			},

			ajaxProcessing : function(data) 
			{
				if (data && data.hasOwnProperty('rows')) 
				{
					var rowIndex, row, columnIndex, 
					rowsFromJson = data.rows,
					numberOfRows = data.totalRows,
					headers = data.headers,
					rows = [],
					length = rowsFromJson.length;
					
					for (rowIndex = 0; rowIndex < length; rowIndex++) {
						row = []; 
						
						for (columnIndex in rowsFromJson[rowIndex]) 
						{
							if (typeof (columnIndex) === "string") 
							{
								row.push(rowsFromJson[rowIndex][columnIndex]); 
							}
						}
						rows.push(row); 
					}
					
					return [ numberOfRows, rows, headers ];
				}
			},


			output : '{startRow} a {endRow} ({totalRows})',
			updateArrows : true,
			page : 0,
			size : paginationSize,
			fixedHeight : false,
			removeRows : false,

			cssNext : '.nextItauTableSorter', 
			cssPrev : '.prevItauTableSorter', 
			cssFirst : '.firstItauTableSorter', 
			cssLast : '.lastItauTableSorter', 
			cssPageDisplay : '.pagedisplayItauTableSorter', 
			cssPageSize : '.pagesizeItauTableSorter', 
			cssErrorRow : 'tablesorter-errorRow', 

			cssDisabled : 'disabled',
			savePages: false, 
			paginationElement: paginationElement,
			noDataMessage: noDataMessage
					

		});
	};

}(jQuery));

/*
 * OBS: Revias função - esta função nào é a original do projeto
  Pra que serve: 
  Como usar: 
  Retorno:
*/
function ehCpfValido(strCPF) {
    var soma;
    var resto;
    soma = 0;
    var i = 1;
    var x = 1;

    strCPF = strCPF.replace(".", "").replace(".", "").replace("-", "");
    
	if (strCPF == "00000000000" || strCPF == "11111111111" || strCPF == "22222222222" || strCPF == "33333333333" || 
		strCPF == "44444444444" || strCPF == "55555555555" || strCPF == "66666666666" || strCPF == "77777777777" || 
		strCPF == "88888888888" || strCPF == "99999999999"){
		return false;
	}
    
	for (i=1; i<=9; i++){soma = soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);}
	resto = (soma * 10) % 11;
	
    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(strCPF.substring(9, 10))){ 
    	return false;
    }
	
	soma = 0;
    for (x=1; x<=10; x++){soma = soma + parseInt(strCPF.substring(x-1, x)) * (12 - x);}
    resto = (soma * 10) % 11;
	
    if ((resto == 10) || (resto == 11)){resto = 0;}
    if (resto != parseInt(strCPF.substring(10, 11))){
    	return false;
    }
    
    return true;
    
};

// ajuste de acessibilidade realizada com a marcação 18/02/2016-ACESSIBILIDADE - INICIO
var $scopeAccessibility = {};

$scopeAccessibility.addRequiredField = function(){
	$(element).attr("aria-required","true");
};

$scopeAccessibility.removeAccessibleError = function(element){
	var idElementError = element + "_error";
	$("#"+idElementError).remove();
	$(element).removeAttr("aria-invalid");
	$(element).removeAttr("aria-describedby");
	
};

$scopeAccessibility.addAccessibleError = function(element, msgError){

	try{
		if ($(element)) {
			var idElementError = $(element).attr("id") + "_error";
			
			if (!$("#"+idElementError)[0]){
				var campoTitulo = $(element).attr("title");
				if (!campoTitulo) {
					campoTitulo = $(element).attr("id");
				};
				var divError = '<div class="element-access-hide" id="'+idElementError+'" role="alert"> Há um erro no preenchimento do campo '+campoTitulo+" "+msgError+'</div>';
				$(divError).prependTo("body");
			};
		
			var ariaInvalid = "false";
			if (msgError.trim() != "") {
				ariaInvalid = "true";
			};
			$(element).attr("aria-invalid", ariaInvalid);
			$(element).attr("aria-describedby", idElementError);
		};
	} catch (err) {
		console.log(err);
	};
};

$scopeAccessibility.onFocusAccessibility = function (element){
	$(element).on("focus", function(){
		$scopeAccessibility.addAccessibleError($(this), $($($(this).parent()).children(".mensagem-erro")).children(".erro-campo").text());
	});
};
// ajuste de acessibilidade realizada com a marcação 18/02/2016-ACESSIBILIDADE - FIM

// ajuste de tooltip invertido 23/02/2016 - Inclusao na assinatura do inverterToolTip - INICIO
function mudaCssErroPika(campo){
	var input = $(campo);
	if ($(input)){
		var tamanho_input = parseInt($(input).css( "height" ).replace(/\D+$/g, ''));
		tamanho_input = tamanho_input - 5;
		var topMensagem = $(input).offset().top - tamanho_input;
		var leftMensagem = $(input).offset().left + 82;
		var mensagem = $($(input).parent()).children(".mensagem-erro");
		if ($(mensagem)) {
			var campo = $(mensagem).children(".erro-campo")[0];
			var seta = $(mensagem).children(".erro-seta")[0];
			if (seta && campo) {
				var tamanho_campo = parseInt($(campo).css( "height" ).replace(/\D+$/g, ''));
				$(mensagem).offset({top:topMensagem,left:leftMensagem});
				tamanho_campo = tamanho_campo - 5;
				$(seta).attr("style", "left:8px;border-top: 5px solid #464646;border-bottom: 0px;top:"+tamanho_campo+"px");
			}
		};
	};
};

function retornaCssErroPika(campo){
	var input = $(campo);
	if ($(input)){
		var mensagem = $($(input).parent()).children(".mensagem-erro");
		if ($(mensagem)) {
			var seta = $(mensagem).children(".erro-seta");
			$(mensagem).removeAttr("style");
			$(seta).attr("style", "left:8px;");
		};
	};
};
// ajuste de tooltip invertido 23/02/2016 - Inclusao na assinatura do inverterToolTip - FIM

// ajuste de tooltip invertido 23/02/2016 - Inclusao na assinatura do inverterToolTip
function tratarSaidaErro(erros, inverterToolTip) {
	
	//Retira a classe reponsavel pela apresentacao visual dos campos que estÃ£o invalidos 
	//Tambem retira os eventos focus/blur/click dos campos que estao invÃ¡lidos
	$(".invalido").each(function() {	
		// ajuste de acessibilidade realizada com a marcação 18/02/2016-ACESSIBILIDADE - INICIO
		$scopeAccessibility.removeAccessibleError($(this).attr("id"));
		$(this).removeAttr("validacao");
		// ajuste de acessibilidade realizada com a marcação 18/02/2016-ACESSIBILIDADE - FIM
		$(this).removeClass("invalido");
		$(this).unbind("focus");
		$(this).unbind("blur");
		$(this).unbind("click");
	});
	$('body').off("focusin", '.invalido');
	$('body').off("focusout", '.invalido');

	//Retira todos as mensagens de erro (ToolTip)
	$(".hasTooltip").each(function(){ $(this).removeClass("hasTooltip").prevAll(".mensagem-erro:first").remove(); });

	//Percorre array de erros retornado pela biblioteca de validacao
	for (var i = 0; i < erros.length; i++) {		
		//Inicia binds (css / eventos jQuery)
		var erro = erros[i];
		$("#"+erro.id).addClass("invalido").attr('validacao', 'campo' + (i + 1));		
		initFormValidationEvents(erro);
	}

	configureForm();

	//Rola a tela e pÃµe foco no primeiro elemento com erro
	var firstID = $(".invalido:first");
	if (firstID) {
		var positionToScroll = $(firstID).offset().top-200;
		$('html, body').animate({ scrollTop: positionToScroll}, 'slow', function(){	
			if (firstID) {
				$(firstID).focus();
				$(firstID).prev().show(); //alterado aqui
			}
		});
	}

	// ajuste de acessibilidade realizada com a marcação 18/02/2016-ACESSIBILIDADE - INICIO
	var invalidsFields = $(".invalido");
	invalidsFields.each(function(idx, el){
		$scopeAccessibility.onFocusAccessibility($(el));
		// ajuste de tooltip invertido 23/02/2016 - INICIO
		if (inverterToolTip && inverterToolTip == true){
			retornaCssErroPika($(el));
			mudaCssErroPika($(el));
		};
		// ajuste de tooltip invertido 23/02/2016 - FIM
	});
	// ajuste de acessibilidade realizada com a marcação 18/02/2016-ACESSIBILIDADE - FIM

};

var configureForm = function(){
	$('.mensagem-erro').hide();

	$('.invalido').focus(function() {
		$('.mensagem-erro').hide();
		$("." + $(this).attr('validacao')).show();
	});

	$('.invalido').blur(function() {
		$('.mensagem-erro').hide();
	});

	$('.invalido').each(function(index, element) {
		var newIndex = index + 1;
		$(this).attr('validacao', 'campo' + newIndex);
	});

	$('.mensagem-erro').each(function(index, element) {
		var newIndex = index + 1;
		$(this).addClass('campo' + newIndex);
	});

}

var mensagensValidacao = { 
	input: "campo preenchido incorretamente",
	inputVazio: "preenchimento obrigat&oacute;rio",
	inputGrupo: "preencha ao menos um campo",
	inputGrupoLinha: "preencha todos os campos dessa linha",
	radio: "campo obrigat&oacute;rio",
	checkbox: "campo obrigat&oacute;rio",
	checkboxGrupo: "selecione um item",
	select: "selecione uma op&ccedil;&atilde;o",
	password: "campo preenchido incorretamente"
};

//Inicia binds (on focus, on blur, on change, on keyup) nos elementos com erro
//Adiciona html responsável por montar o Tooltip
function initFormValidationEvents(erro) {	
	
	var id = erro.id;
	var objeto = "#"+id;
	var mensagem;
	
	if (erro.mensagem) { mensagem = erro.mensagem; }
	else { mensagem = $(objeto).data('mensagem-validacao'); }
	
	//Correção para elementos parent com position relative no qual o tooltip é quebrado
	if ($(objeto).parent().is("p")) {
		if ($(objeto).parent().css("position") == "relative") { $(objeto).parent().css("position", "static"); }
	}
  	if ($(objeto).parent().is("label")) {
		if ($(objeto).parent().css("position") == "relative") { $(objeto).parent().css("position", "static"); }
	}
	
	if ($(objeto).is("input")) {

		var type = $(objeto).attr("type");
		//Input text - alterado aqui
		if (type == "text" || type == "tel" || type == "email") { 

			if (!mensagem) { 
				if (erro.requerido) {
					mensagem = mensagensValidacao.inputVazio;
				} else {
					mensagem = mensagensValidacao.input; 
				}
			} 

			if (!erro.grupoLinha) {
				if (erro.grupo) { mensagem = mensagensValidacao.inputGrupo; }
				initTextInputEvents(id, mensagem); 
			}
			else {
				mensagem = mensagensValidacao.inputGrupoLinha;
				var grupoLinha = $(objeto).data("grupo-linha");

				$("input:text[data-grupo-linha="+grupoLinha+"]").each(function() { 
					if ($(this).val() == "") { 
						initTextInputEvents($(this).attr("id"), mensagem);												
					}
				});
			}
		}
		//Input password
		if (type == "password") { 

			if (!mensagem) { mensagem = mensagensValidacao.password; } 

			initTextInputEvents(id, mensagem); 
		}
		//Input radio
		if (type == "radio") { 
			
			if (!mensagem) { mensagem = mensagensValidacao.radio; }

			if (!$(objeto).hasClass("hasTooltip")) {
				printTooltip(objeto, mensagem);
				$(objeto).addClass("hasTooltip");
			}
			
			var name = $(objeto).attr("name");
		
			$("input:radio[name="+name+"]").change(function() {
				$("input:radio[name="+name+"]").each(function() {
					$(this).removeClass("invalido");
					if ($(this).hasClass("hasTooltip")) {
						$(this).removeClass("hasTooltip").prevAll(".mensagem-erro:first").remove();
						$scopeAccessibility.removeAccessibleError($(this).attr("id"));
					}
				}); 
			}); 
		}
		//Input checkbox
		if (type == "checkbox") { 
			
			var grupo = $(objeto).data("grupo");

			if (!mensagem) { 
				if (grupo) { mensagem = mensagensValidacao.checkboxGrupo; }
				else { mensagem = mensagensValidacao.checkbox; }
			}
			
			if (!$(objeto).hasClass("hasTooltip")) {
				printTooltip(objeto, mensagem);
				$(objeto).addClass("hasTooltip");
			}
      
      
			if (grupo) {
				$("input:checkbox[data-grupo="+grupo+"]").change(function() {
					$("input:checkbox[data-grupo="+grupo+"]").each(function() {
						$(this).removeClass("invalido");
						if ($(this).hasClass("hasTooltip")) {
							$(this).removeClass("hasTooltip").prevAll(".mensagem-erro:first").remove();
							$scopeAccessibility.removeAccessibleError($(this).attr("id"));
						}
					}); 
				}); 
			}
			else {
				$(objeto).change(function() {
					$(this).removeClass("invalido");
					if ($(this).hasClass("hasTooltip")) {
						$(this).prev().remove();
						$(this).removeClass("hasTooltip");
						$scopeAccessibility.removeAccessibleError($(this).attr("id"));
					}
				});
			}
		}
	}
	
	//Select
	if ($(objeto).is("select")) { 
		
		if (!mensagem) { mensagem = mensagensValidacao.select; }

		var selectObjeto = objeto;
		if($(objeto).hasClass('chosen-select')){
			var idChosen = id + "_chosen";
			objeto = $("#" + idChosen);
		}
		if (!$(objeto).hasClass("hasTooltip")) {
			printTooltip(objeto, mensagem);
			$(objeto).addClass("hasTooltip");
		}

		$(selectObjeto).change(function(){
			$(objeto).removeClass("invalido");
			if ($(objeto).hasClass("hasTooltip")) {
				$(objeto).prev().remove();
				$(objeto).removeClass("hasTooltip");
				$scopeAccessibility.removeAccessibleError($(objeto).attr("id"));
			}
		});

	}
}

function initTextInputEvents(id, mensagem) {
	
	var objeto = "#"+id;
	
	$(objeto).addClass("invalido");
	
	$(objeto).focus(function() {
		if ($(objeto).hasClass("invalido") && !$(objeto).hasClass("hasTooltip")) {
            
     			printTooltip(objeto, mensagem);
      
			$(objeto).addClass("hasTooltip");		
		}
	});
	
	$(objeto).blur(function(){
		if ($(objeto).hasClass("hasTooltip")) {
			$(objeto).prev().remove();
			$(objeto).removeClass("hasTooltip");
			$scopeAccessibility.removeAccessibleError($(objeto).attr("id"));
		}
	});
	
	$(objeto).bind('keyup', function(e) {
		 var code = e.keyCode || e.which;
		 if(code != 9 && code != 16) { 
			if ($(objeto).hasClass("hasTooltip")) {
				$(objeto).prev().remove();
				$(objeto).removeClass("invalido");
				$(objeto).removeClass("hasTooltip");
				$scopeAccessibility.removeAccessibleError($(objeto).attr("id"));

				$(objeto).unbind("focus");
				$(objeto).unbind("blur");
				$(objeto).unbind("click");
			}
		 }
	});
	
	$(objeto).change(function() {
		if ($(objeto).hasClass("hasTooltip")) {
			$(objeto).prev().remove();
			$(objeto).removeClass("invalido");
			$(objeto).removeClass("hasTooltip");
			$scopeAccessibility.removeAccessibleError($(objeto).attr("id"));

			$(objeto).unbind("focus");
			$(objeto).unbind("blur");
			$(objeto).unbind("click");
		}
	});
}

function printTooltip(objeto, mensagem) {
  	var tooltipHtml = "<div class='mensagem-erro' role='alert'><span class='erro-seta' style='left: 8px'></span><span class='erro-campo'>{0}</span></div>";
  	
 	$(objeto).before($.validador.util.formatar(tooltipHtml, [mensagem]));
  	adjustTooltipPosition(objeto);
}

function adjustTooltipPosition(objeto) {
	
	var tooltip = $(objeto).prev();
	
	var elementHeight = parseFloat(tooltip.css("height"));
	var elementPosition = getElementPosition(objeto);
	
	if($(objeto).hasClass("chosen-select")){
		elementPosition = getElementPosition($(objeto).next());
	}
	
	var tooltipX = elementPosition.x;
	var tooltipY = elementPosition.y - elementHeight;
	
	if ($(objeto).is("input")) {
		if (($(objeto).attr("type") == "radio") || ($(objeto).attr("type") == "checkbox")) {
			tooltipX -= 8;
		}
	}
	
	tooltip.css({"left": tooltipX+"px", "top": tooltipY+"px"});
}

function getElementPosition(element) {
	
 	//Get element position
	var offset = $(element).offset();
	
	var popupX = Math.round(offset.left); 
	var popupY = Math.round(offset.top);
	
	if ($(element).closest('.modulo-lightbox').length) {

		var lightboxOffset = $(element).closest('.modulo-lightbox').offset();

		var lightboxPopupX = Math.round(lightboxOffset.left); 
		var lightboxPopupY = Math.round(lightboxOffset.top);
		
		popupX = popupX - lightboxPopupX;
		popupY = popupY - lightboxPopupY;
	}
	
	var position = { x: popupX, y: popupY };
	
	return position;
}

//Função responsável por montar o popup de ajuda em todos os segmentos.
function popAjuda( posX, posY, titulo, texto ){
	$("#popMain").html("<p class='paragrafoAjuda'>" + titulo + "</p>" + texto);
	$("#popAjuda").parent().css({position: 'relative'});
	$("#popAjuda").css({top: posY, left:  posX, position:'absolute'}).show();
	$("#popFechar").on( "click",function(){
	$("#popAjuda").hide();
	}).css("cursor","pointer");
}

//Função responsável por zebrar a tabela (cores diferentes para cada linha)
function zebrarTabela(idTabela){
	$("table[id='" + idTabela + "'] tbody tr:odd").addClass('linhaPar');
	$("table[id='" + idTabela + "'] tbody tr:even").addClass('linhaImpar');
}

//Máscaras
function mascararCpf(idInput){
	$('#' + idInput).mask('999.999.999-99');
}

function mascararCnpj(idInput){
	$('#' + idInput).mask('99.999.999/9999-99');
}

function mascararTel(idInput){
	$('#' + idInput).mask('99999-9999');
}

function mascararTelDdd(idInput){
	$('#' + idInput).mask('99 99999-9999');
}

function mascararTelDdiDdd(idInput){
	$('#' + idInput).mask('99 99 99999-9999');
}

//Formatadores
function formatarValorMonetario(idInput){
	$('#' + idInput).maskMoney({symbol:'R$', 
		showSymbol:false, thousands:'.', decimal:',', symbolStay: true});
}

function formatarValorInteiro(idInput){
	$('#' + idInput).maskMoney({symbol:'', 
		showSymbol:false, thousands:'.', decimal:',', symbolStay: true , precision:0});
}

function imprimirComprovante(){
	var url = $("#resourcesJs")[0].href;
	window.open(url + "/commons/html/VersaoImpressao.htm", "Comprovante", "left=0,top=0,location=no,toolbar=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,copyhistory=no,width=650,height=450");
}

function abreCalculadora()
{
	var url = $("#resourcesJs")[0].href;
	window.open(url + "/commons/calculadora/calculadora.html", "Calculadora", "'toolbar=no,left=0,top=0,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width=190,height=200");

}

function ApagaSenha() {
	var i=0, j=0;
	for (j=0; j<document.forms.length; j++) {
		for (i=0; i<document.forms[j].elements.length; i++) {
			if (document.forms[j].elements[i].type == "password") {
				document.forms[j].elements[i].value="";
				break;
			}
		}
	}
}

function tabAutom(objeto){
	//TODO: Verificar com Vander
	return;

}

function comprovantePrint(id, op){
	var template = $('#templatePrintAndPDF').html();
	var content = $('#'+id).html();				
	var rendered = Mustache.render(template, {content : content});			
	var w = window.open("", "Comprovante", "left=0,top=0,location=no,toolbar=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,copyhistory=no,width=650,height=500");
	var styleAbsPath = $("link[href*='itau-style.css']").prop("href");
    	w.document.write(rendered);
	w.document.write("<link rel=\"stylesheet\" href=\"" + styleAbsPath + "\"/ onload='window.print();window.close();'>");
}

function convertTextEncoding(text){
	var tf1 =new Array("Á","á","Â","â","À","à","Å","å","Ã","ã","Ä","ä","Æ","æ","É","é","Ê","ê","È","è","Ë","ë","Í","í","Î","î","Ì","ì","Ï","ï","Ó","ó","Ô","ô","Ò","ò","Õ","õ","Ö","ö","Ú","ú","Û","û","Ù","ù","Ü","ü","Ç","ç","Ñ","ñ");
	var tf2=new Array("&Aacute;","&aacute;","&Acirc;","&acirc;","&Agrave;","&agrave;","&Aring;","&aring;","&Atilde;","&atilde;","&Auml;","&auml;","&AElig;","&aelig;","&Eacute;","&eacute;","&Ecirc;","&ecirc;","&Egrave;","&egrave;","&Euml;","&euml;","&Iacute;","&iacute;","&Icirc;","&icirc;","&Igrave;","&igrave;","&Iuml;","&iuml;","&Oacute;","&oacute;","&Ocirc;","&ocirc;","&Ograve;","&ograve;","&Otilde;","&otilde;","&Ouml;","&ouml;","&Uacute;","&uacute;","&Ucirc;","&ucirc;","&Ugrave;","&ugrave;","&Uuml;","&uuml;","&Ccedil;","&ccedil;","&Ntilde;","&ntilde;");
	for (var ii = 0; ii < tf1.length; ii++) {
		text = text.replace(new RegExp(tf1[ii],"g"),tf2[ii]);        
	}   
	return text;
}

function comprovantePDF(idContent, idForm, idHidden) {
	
	idContent = formatToPdf(idContent);
	
	var template = $('#templatePrintAndPDF').html();
	var content = $('#'+idContent).html();
	var item = {content : content}
	
	var html = Mustache.render(template,item);
	
	$(html).find('caption').remove();
	
	html = convertTextEncoding(html);
	
	html = html.replaceAll("\r", " "); 
	html = html.replaceAll("\t", " ");
	html = html.replaceAll("\n", " ");
	
	$('#'+idHidden).val(html);   
	$('#'+idForm).submit();
	
}

function saveAsPdf(uri, filename) {
	var link = document.createElement('a');
	if ( typeof link.download === 'string' ) {
		link.href = uri;
		link.download = filename;

		//Firefox requires the link to be in the body
		document.body.appendChild(link);
			
		//simulate click
		link.click();

		//remove the link when done
		document.body.removeChild(link);
	} else {
		window.open(uri);
	}
}

function criarPdf(idContent, idForm, idHidden, nomeArquivo){
	if (nomeArquivo == undefined) {
		nomeArquivo = "comprovante.pdf";
	}
	
	var html = $("#"+idContent).clone();
	$(html).find('caption').remove();

	html = html.html();
	html = convertTextEncoding(html);

	html = html.replaceAll("\r", " "); 
	html = html.replaceAll("\t", " ");
	html = html.replaceAll("\n", " ");

    if (jQuery.browser.name === "Safari" || jQuery.browser.name === "Firefox") {

        $.ajax({
            url: $("#abrirPdf").val(),
            type: "POST",
            data: {
                html: html,
                tipoArquivo: "pdf"
            },
            headers: {
                "ajaxRequest": true
            },
            success: function(data) {
                saveAsPdf("data:application/pdf;base64, " + data, nomeArquivo);
            }
        });

    } else {

        $('#'+idHidden).val(html);
        $('#'+idForm).submit();

    }

}

function imprimirHtml(id, op){
    var w = window.open("", "Comprovante", "left=0,top=0,location=no,toolbar=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,copyhistory=no,width=650,height=500");
	$.ajax({
        url: op,
        type: "POST",	
        data:{
           	htmlContent:$("#"+id).html(),
           	tipoArquivo:"print"
        },
         headers:{
     		"ajaxRequest":true
         },
        showLoading:false,
        success: function(data) {
   	    	w.document.write(data);
   	    	w.document.close();
			var readyStateCheckInterval = setInterval(function() {
				if (document.readyState === "complete") {
					clearInterval(readyStateCheckInterval);
					setTimeout(function() {
						w.focus();
						w.print();
					}, 1000);
				}
			}, 100);
        },
		error: function() {
			w.close();
			if($('#mensagemErroPdf').length < 1) {
				var erro  = "<div id='mensagemErroPdf' class='box-info box-info-erro'>\n";
				erro += "	<span class='icone'></span>\n";
				erro += "	<p>Houve um erro ao imprimir, tente novamente mais tarde.</p>\n";
				erro += "</div>\n";
				$('[role="main"]').prepend(erro);
			}
		}
    });
}

function abrirJanelaImpressao(){
	return window.open("", "", "left=0,top=0,location=no,toolbar=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,copyhistory=no,width=650,height=500");
}

function imprimirTemplateHTML(titulo, id, op, conteudoHtml, dataHoraAtualizacao, janela){
	var w = janela ? janela : abrirJanelaImpressao();
	var htmlContent;

	if (id) {
		htmlContent = document.getElementById(id).outerHTML;
	}
	else {
		htmlContent = conteudoHtml;
	}

	$.ajax({
		url: op,
		type: "POST",	
		data:{
			titulo: titulo,
			htmlContent: htmlContent,
			dataHoraAtualizacao: dataHoraAtualizacao
		},
		headers:{
			ajaxRequest: true,
			scrollToTop : false
		},
		showLoading:false,
		success: function(data) {
			if ($($.parseHTML(data)).hasClass('divErroVisaoCliente')) {
				$('#content').html(data);
				return;
			}
			w.document.write(data);
			w.document.close();

			var readyStateCheckInterval = setInterval(function() {
				if (document.readyState === "complete") {
					clearInterval(readyStateCheckInterval);
					setTimeout(function() {
						w.focus();
						w.print();
						w.close();
					}, 1000);
					removerMensagemErroImpressaoHTML();
				}
			}, 100);
		},
		error: function() {
			w.close();
			window.scrollTo(0, 0);
			if($('#mensagemErroPdf').length < 1) {
				var erro  = "<div id='mensagemErroPdf' class='box-info box-info-erro' role='alert'>\n";
				erro += "	<span class='icone'></span>\n";
				erro += "	<p>Houve um erro ao imprimir, tente novamente mais tarde.</p>\n";
				erro += "</div>\n";
				$('[role="main"]').first().prepend(erro);
			}
		}
	});
}

function removerMensagemErroImpressaoHTML(){
	$('#mensagemErroPdf').remove();
}

function imprimirTemplateFrameHTML(titulo, idConteudo, op, conteudoHtml, dataHoraAtualizacao) {

	var htmlContent;
	
	if (idConteudo) {
		htmlContent = document.getElementById(idConteudo).outerHTML;
	}
	else {
		htmlContent = conteudoHtml;
	}

	$.ajax({
		url: op,
		type: "POST",
		data: {
			titulo: titulo,
			htmlContent: htmlContent,
			dataHoraAtualizacao: dataHoraAtualizacao
		},
		headers: {
			ajaxRequest: true,
			scrollToTop: false
		},
		success: function (data) {                   
			var newNode = document.createElement('iframe');
			newNode.classList.add("text-access-hide");
			document.body.appendChild(newNode); 

			newNode.onload = function (){
				 if (newNode.contentWindow.document.readyState == "complete") {
					setTimeout(
						function() {
							 try {
								 if (newNode.contentWindow.document.execCommand('print', false, null) == false) {
									 throw new Error();
								 }
							 } catch(e) {
								 newNode.contentWindow.print();
							 }
							 document.body.removeChild(newNode);
							 removerMensagemErroImpressaoHTML();
					 },1000);
				}
		   };
		   newNode.contentDocument.write(data);
		   newNode.contentDocument.close();
		},
		error: function (erro) {
			console.log(erro);
			window.scrollTo(0, 0);
			if ($('#mensagemErroPdf').length < 1) {
				var erro = "<div id='mensagemErroPdf' class='box-info box-info-erro' role='alert'>\n";
				erro += "   <span class='icone'></span>\n";
				erro += "   <p>Houve um erro ao imprimir, tente novamente mais tarde.</p>\n";
				erro += "</div>\n";
				$('[role="main"]').first().prepend(erro);
			}
		}
	});
}

function salvarEmPDF(titulo, idConteudo, idFormulario, conteudoHtml, dataHoraAtualizacao){
	var formulario = document.getElementById(idFormulario);
	var conteudo;
	
	if (idConteudo) {
		conteudo = document.getElementById(idConteudo).outerHTML;
	} else {
		conteudo = conteudoHtml;
	}

	if (conteudo) {
		conteudo = conteudo.replace(/\\n/g, "\\n")  
          		         .replace(/\\'/g, "\\'")
          		         .replace(/\\"/g, '\\"')
          		         .replace(/\\&/g, "\\&")
          		         .replace(/\\r/g, "\\r")
          		         .replace(/\\t/g, "\\t")
          		         .replace(/\\b/g, "\\b")
          		         .replace(/\\f/g, "\\f")
          		         .replace(/[\u0000-\u0019]+/g,"");
	}

	$('input[name=htmlContent]', formulario).val(conteudo);
	$('input[name=titulo]', formulario).val(titulo);
	$('input[name=dataHoraAtualizacao]', formulario).val(dataHoraAtualizacao);
	$(formulario).submit();
}

function convertHtmlEntity(str){
	var temp=document.createElement("pre");
	temp.innerHTML=str;
	return temp.firstChild.nodeValue;
}

function gravaCookie(nome, valor, duracaoDias) {
	var expira = "";
	if (duracaoDias) {
	  var data = new Date();
	  data.setTime(data.getTime() + (duracaoDias*24*60*60*1000));
	  expira = "; expires=" + data.toUTCString();
	}
	document.cookie = nome + "=" + valor + expira + "; path=/";
}
  
function leCookie(nome) {
	var nomeIgual = nome + "=";
	var dadosCookie = document.cookie.split(';');
	for (var i=0; i < dadosCookie.length; i++) {
	  var cookie = dadosCookie[i];
	  while (cookie.charAt(0) == ' ') {
		  cookie = cookie.substring(1, cookie.length);
	  }
	  if (cookie.indexOf(nomeIgual) == 0) {
		return cookie.substring(nomeIgual.length, cookie.length);
	  }
	}
	return 'true';
}

function validaSenhaAjaxRequest(op, data, successHandler, errorHandler) {
	SecUIHelper.escondeMensagemSuperior();
	$.Ajax({
		method: 'POST',
		data: data,
		showLoading: true,
		headers: {
			"op": op,
			ajaxRequest : true,
			scrollToTop: false
		},
		success: function (data, textStatus, xhr) {
			try{
				jQuery.parseJSON(data);
				successHandler(data, textStatus, xhr);
			}catch(e){
				$('#content').html(data);
				$.event.trigger({type: "conteudo:carregado"});
		        $(document).ready(BackInterceptor.readyCallBack());
			}
		},
		error: function (error) {
			if(error){
				if (typeof (error) == 'object') {
					try{
						var resposta = jQuery.parseJSON(error.msg);
	            		if(resposta.senhaInvalida){
	            			SecUIHelper.exibeMensagemSuperior(resposta.senhaInvalida);
	            		}else{
	            			errorHandler(error);
	            		}
					}catch(e){
						try{
							jQuery.parseJSON(error.data);
							errorHandler(error);
						}catch(e){
							$('#content').html(error.data);
							$.event.trigger({type: "conteudo:carregado"});
					        $(document).ready(BackInterceptor.readyCallBack());
						}
					}	
	            }
	        }
		}
	});
};
//----------------------------------------------------------------------------
//
//  /////	/	/	/       /	/       /	////	/////			/	/////
//	/		/	/	//     //	//     //	/		/	/			/	/
//	/////	/	/	/ /	  / /	/ /	  / /	////	/////    		/	/////
//		/	/	/	/  / /  /	/  / /  /	/		/  /			/		/
//	/////	/////	/   /   /	/   /   /	////	/ 	/		/////	/////
//
//----------------------------------------------------------------------------



/*******************************************************************************
 * @author Deivid Martins
 * 
 * Classe Digito que contem métodos sobre digitos
 * 
 */
var Digito = {
	/**
	 * Retorna se todos os digitos de uma sequência são os mesmos
	 * 
	 * @param sequencia
	 * @returns true para todos os digitos iguais e false caso o contrario
	 */
	todosOsDigitosSaoRepetidos : function(sequencia) {
		var regexRepetidos = /\b(\d+)\1+\b/;

		return regexRepetidos.test(sequencia);
	},
	
	/***
	 * Retorna somente digitos de uma String exemplo 1.7x-4? retorna 174
	 * @param digito
	 * @returns somente os digitos dessa sequencia
	 */
	somenteDigitos : function(sequencia) {
		var regexNaoDigitos = /[^0-9]+/;
		return sequencia.replaceAll(regexNaoDigitos, "");
	}
};


/**
 * Adicionando método replaceAll a classe String 
 * @param find
 * @param replace
 * @returns String com todas as ocorrencias de find removidas
 */
String.prototype.replaceAll = function(find, replace) {
	return this.split(find).join(replace); 
};


/**
 * @author Deivid Martins
 * 
 * classe Cpf para validação e formatação de cpf
 */
var Cpf = function(cpfPassado) {
	var cpf = cpfPassado;

	/***
	 * Valida um CPF
	 * @returns true para CPF valido e false para CPF invalido
	 */
	this.valido = function() {
		cpf = Digito.somenteDigitos(cpf);

		if (Digito.todosOsDigitosSaoRepetidos(cpf)) {
			return false;
		}

		if (tamanhoInvalido()) {
			return false;
		}

		return digitosVerificadoresValidos();
	};
	
	var tamanhoInvalido = function()
	{
		return cpf.length != 11;
	};

	var digitosVerificadoresValidos = function() {
		return calculaDigitoVerificador("primeiro") && calculaDigitoVerificador("segundo");
	};

	var calculaDigitoVerificador = function(indice) {
		var soma = 0;

		if (indice === "primeiro")
			indice = 9;
		else
			indice = 10;

		for (var i = 0; i < indice; i++) {
			soma += ((indice + 1) - i) * (cpf.charAt(i) - 0);
		}
		soma = 11 - (soma % 11);
		if (soma > 9)
			soma = 0;

		return soma == (cpf.charAt(indice) - 0);
	};
};


/***
 * @author Deivid Martins
 * 
 * Classe responsavel por validar CNPJ
 */
var Cnpj = function(cnpjPassado) {
	var cnpj = Digito.somenteDigitos(cnpjPassado);

	/***
	 * Valida um CNPJ
	 * @returns true para CNPJ valido e false para CPF invalido
	 */
	this.valido = function() {
		
		return tamanhoValido() && digitosVerificadoresValidos();

	};
	
	var digitosVerificadoresValidos = function() {
		return calculaDigitoVerificador("primeiro") && calculaDigitoVerificador("segundo");
	};
	
	var tamanhoValido = function()
	{
		return cnpj.length == 14;
	};
		
	var calculaDigitoVerificador = function(indice)
	{
		var j, max, soma = 0;
		if(indice === 'primeiro')
		{
			j = 5;
			max = 12;
		}
		else
		{
			j = 6;
			max= 13;
		}
		for (var i = 0; i < max; i++) {
			soma += j-- * (cnpj.charAt(i) - 0);

			if (j < 2)
				j = 9;
		}

		soma = 11 - (soma % 11);
		
		if (soma > 9)
			soma = 0;
		
		return soma == (cnpj.charAt(max) - 0);
	};

};

	
	function insertBalloon(elemento, mensagem, flagBottom) {
		var flagBottom = flagBottom!=null?true:false;
		if(flagBottom){
			var cssBalloon = '<style type="text/css" id="tootip_ballon">\n' +
			'.mensagem-erro-balloon {display: block;font-size: 12px;margin-top: 55px;position: absolute;visibility: visible;z-index: 1200;margin-left:45px}\n' +
			'.erro-seta-balloon {border-color: transparent;border-style: solid;height: 0;position: absolute;width: 0;}\n' +
			'.mensagem-erro-balloon .erro-seta-balloon {border-bottom-color: #404040;border-width: 0 5px 5px;top: -11px;left: 15%;}\n' +
			'.mensagem-erro-balloon .erro-campo-balloon {background-color: #404040;border-radius: 4px;color: #fff;max-width: 200px;padding: 6px 10px;text-align: left;text-decoration: none;}\n' +
			'</style>\n';
		}else{
			var cssBalloon = '<style type="text/css"  id="tootip_ballon">\n' +
								'.mensagem-erro-balloon {display: block;font-size: 12px;margin-top: -10px;position: absolute;visibility: visible;z-index: 1200;}\n' +
								'.erro-seta-balloon {border-color: transparent;border-style: solid;height: 0;position: absolute;width: 0;}\n' +
								'.mensagem-erro-balloon .erro-seta-balloon {border-top-color: #404040;border-width: 5px 5px 0;bottom: -11px;left: 20%;}\n' +
								'.mensagem-erro-balloon .erro-campo-balloon {background-color: #404040;border-radius: 4px;color: #fff;max-width: 200px;padding: 6px 10px;text-align: left;text-decoration: none;}\n' +
								'</style>\n';
		}	
		
        var varHTML =   '<div id="' + elemento[0].id + 'balloon" class="mensagem-erro-balloon">' +
                            '<span class="erro-seta-balloon"></span>' +
                            '<span class="erro-campo-balloon">' + mensagem + '</span>' +
                        '</div>';
        $('head').append(cssBalloon);
        
        $(elemento).before(varHTML);
        $('#' + elemento[0].id + 'balloon').show();
        
    }

    function removeBalloon(elemento) {
        $('#' + elemento[0].id + 'balloon').remove();
        $('#tootip_ballon').remove();
    }
    
	function insertBalloonTxtArea(elemento, mensagem) {
		
		var cssBalloonTxtArea = '<style type="text/css">\n' +
							'.mensagem-erro-balloon-txtarea {display: block;font-size: 12px;margin-top: -25px;position: absolute;visibility: visible;z-index: 1200;}\n' +
							'.erro-seta-balloon-txtarea {border-color: transparent;border-style: solid;height: 0;position: absolute;width: 0;}\n' +
							'.mensagem-erro-balloon-txtarea .erro-seta-balloon-txtarea {border-top-color: #404040;border-width: 5px 5px 0;bottom: -11px;left: 20%;}\n' +
							'.mensagem-erro-balloon-txtarea .erro-campo-balloon-txtarea {background-color: #404040;border-radius: 4px;color: #fff;max-width: 200px;padding: 6px 10px;text-align: left;text-decoration: none;}\n' +
							'</style>\n';
		
		
        var varHTML =   '<div id="' + elemento[0].id + 'balloon" class="mensagem-erro-balloon-txtarea">' +
                            '<span class="erro-seta-balloon-txtarea"></span>' +
                            '<span class="erro-campo-balloon-txtarea">' + mensagem + '</span>' +
                        '</div>';
        $('head').append(cssBalloonTxtArea);
        
        $(elemento).before(varHTML);
        $('#' + elemento[0].id + 'balloon').show();
        
    }

    function removeBalloonTxtArea(elemento) {

        $('#' + elemento[0].id + 'balloon').remove();

    }
﻿/* ==============================================================================================
 * tourElements: Tour de elementos na tela
 * 
 * Descrição: Executa uma apresentação de conteúdo de telas baseado em uma lista
 *
 * Data: 17 ago 2015
 *
 * Exemplo de uso: tourElements.addElements(null, 'XPTO', null);
 *                 tourElements.addElements("#Elem1", '<p>XPTO</p>', 'bottom');
 *                 tourElements.onChangeTour = function() { minhaFuncao };
 *                 tourElements.show();
 *
 * Dependencia JS: jQuery 1.7 ou maior, hopscotch.min.js(0.2.3), pikaday.js
 *
 * Dependencia CSS: itau-style.css, itau-style-pages.css
 * 
 * Versao 1.0.3
 *
 * =============================================================================================== */
var controlePosTour;
var tourElements = {
	btnNextTxt: "Próximo",
	btnPrevTxt: "Voltar",
	btnSkipTxt: "Não, obrigado",
	btnDoneTxt: "Ok",
	fixed: false,
	showNumber: false,
	bullets: true,
	_arEleOld: new Array(),
	_lastStepNum: -1,
	_elementoRec: null,
	_elementos: new Array(),
	_tour: null,
	onChangeTour: undefined,
	onEnterTour: undefined,
	onExitTour: undefined,
	onCompleteMontarTela:undefined,
	onDismiss:undefined,

	getCurrentStep: function() {
		var thisClass = this;
		return thisClass._intro.getCurrStepNum() + 1;
	},

	getIntro: function() {
		return hopscotch;
	},

	addElements: function(elemento, descricao, posicao, fixed) {
		var thisClass = this;
		thisClass._elementoRec = new function() {
			elemento, descricao, posicao, fixed
		};
		thisClass._elementoRec.elemento = elemento;
		thisClass._elementoRec.descricao = descricao;
		thisClass._elementoRec.posicao = posicao;
		thisClass._elementoRec.fixed = fixed;
		thisClass._elementos[this._elementos.length] = this._elementoRec;
	},

	clearElements: function() {
		var thisClass = this;
		thisClass._elementos = new Array()
	},

	_intro: hopscotch,

	show: function() {
		var thisClass = this;
		thisClass._init();
		thisClass._start();
	},

	_init: function() {
		var thisClass = this;
		var scrollTopMargin = parseInt($("header").css("margin-top")) + 100;
		thisClass._tour = {
			id: 'hello-hopscotch',
			i18n: {
				nextBtn : thisClass.btnNextTxt,
				prevBtn : thisClass.btnPrevTxt,
				doneBtn : thisClass.btnDoneTxt,
				skipBtn : thisClass.btnSkipTxt
			},
			steps: thisClass._montaJSONTour(),
			showPrevButton: true,
			scrollTopMargin: scrollTopMargin,
			bubbleWidth: 350,
			skipIfNoElement: false,
			onStart: function() {
				setTimeout(function() {
					thisClass._montaTelaIntro();
					if (thisClass.onEnterTour) {
						thisClass.onEnterTour();
					}
				}, 0);
			},
			onClose: function() {
				thisClass._finalizaTour()
			}
		}
		$(document).bind("keyup.coachmark", function(){
			if(!$(".hopscotch-bubble-container").find("a").is(":focus")){
				$(".hopscotch-bubble-container a:eq('0')").focus();
			}
		});
	},

	_start: function() {
		var thisClass = this;
		thisClass._intro.startTour(thisClass._tour, 0);
	},

	_montaJSONTour: function() {
		var thisClass = this;
		var arElementos = thisClass._elementos;
		var strElemento = "";
		var step = "";
		
		var divCenter = '<div id="idDivCenter" style="opacity: 0; width: 10px; height: 10px; position: absolute; top: ' + ($('body').height() / 2 - 5) + 'px; left: ' + ($('body').width() / 2 - 5) + 'px;"></div>';
		if ($('body').find('#idDivCenter').length == 0) {
			$('body').append(divCenter);
		}
		for (var iLoop = 0; iLoop < arElementos.length; ++iLoop) {
			if (arElementos[iLoop].elemento === null) {
				thisClass._arEleOld[thisClass._arEleOld.length] = $("#idDivCenter");
				strElemento += '{"target" : "#idDivCenter",';
				strElemento += '"content" : "' + arElementos[iLoop].descricao.replace(/\"/g, "\'") + '",';
				strElemento += '"xOffset" : "-195px",';
				strElemento += '"yOffset" : "center",';

				if (arElementos[iLoop].posicao === null) {
					strElemento += '"placement" : "bottom"}';
				} else {
					strElemento += '"placement" : "' + arElementos[iLoop].posicao + '"}';
				}
			} else {
				thisClass._arEleOld[thisClass._arEleOld.length] = $(arElementos[iLoop].elemento).clone();
				strElemento += '{"target" : "' + arElementos[iLoop].elemento + '",';
				strElemento += '"content" : "' + arElementos[iLoop].descricao.replace(/\"/g, "\'") + '",';
				if(arElementos[iLoop].fixed){
					strElemento += '"fixedElement" : "' + arElementos[iLoop].fixed + '",';
				}

				if (arElementos[iLoop].posicao === null) {
					strElemento += '"placement" : "top"}';
				} else {
					strElemento += '"placement" : "'
							+ arElementos[iLoop].posicao + '"}';
				}
				
			}
			if (iLoop != arElementos.length - 1) {
				strElemento += ',\n';
			} else {
				strElemento += '\n';
			}
		}
		step = "[" + strElemento + "]";
		return JSON.parse(step);
	},

	_retornaPath: function() {
		var thisClass = this;
		var strAuxPk = "";
		listaScripts = $('script');
		for (iLoop = 0; iLoop < listaScripts.length; ++iLoop) {
			strAuxPk = $(listaScripts[iLoop]).attr('src');
			if (strAuxPk != null) {
				if (strAuxPk.indexOf('summer-cdn') >= 0) {
					if (strAuxPk.indexOf('http\:\/\/') >= 0) {
						strAuxPk = strAuxPk.substring(0, strAuxPk.indexOf('summer-cdn') + 'summer-cdn'.length);
					} else {
						strAuxPk = strAuxPk.substring(0, strAuxPk.indexOf('summer-cdn') + 'summer-cdn'.length) + '\/WebContent\/';
					}
				}
				return strAuxPk;
			}
		}
	},

	_montaTelaIntro: function() {
		var thisClass = this;
		var objBullet = "";
		var objButtons;
		var overLay = '<div class="hopscotch-overlay" id="divOverlayHopscotch"></div>';
		var header = '<div class="grid-row"><div class="grid-col11"><a class="hopscotch-close fechar" title="Fechar mensagem" href="#" id="fecharTourElements"></a></div></div>';
		var btnSkip = '<div class="grid-col4 txt-bold left"><a href="javascript:void(0);" class="hopscotch-nav-a skip hopscotch-skip hopscotch-close left margem-tour1">' + thisClass.btnSkipTxt + '</a></div>';
		var btnDone = '<div class="grid-col12 center"><a href="javascript:void(0);" class="hopscotch-nav-a skip hopscotch-done hopscotch-close btn btn-fluxo">' + thisClass.btnDoneTxt + '</a></div>';
		if ($('body').find('#divOverlayHopscotch').length == 0) {
			$('body').append(overLay);
		}
		//classe ico-configurações retirada para corrigir erro relacionado a area do cliente, a retirada dessa classe foi testada dentro do guia e não apresentou erro.
		/*if (!$('.hopscotch-bubble').hasClass('ico-configuracoes')) {
			$('.hopscotch-bubble').addClass('ico-configuracoes content-config-helps');
		}*/
		if (!$('.hopscotch-bubble').hasClass('content-config-helps')) {
			$('.hopscotch-bubble').addClass('content-config-helps');
		}
		if (thisClass.showNumber == false) {
			$('.hopscotch-bubble-number').remove();
		}
		objButtons = $('.hopscotch-actions');
		$('.hopscotch-bubble-close.hopscotch-close').addClass('hide');
		if ($('.grid-col12 .hopscotch-close.fechar').length == 0  && $('.grid-col11 .hopscotch-close.fechar').length == 0) {
			$('.hopscotch-content').before(header);
			$('.grid-col12 .hopscotch-close.fechar').on('click', function(evt) {
				$('.hopscotch-bubble-close.hopscotch-close').click();
			});
		}

		objButtons.addClass('grid-row');
		objButtons.html(objButtons.html().replace(/BUTTON/g, 'A'));
		objButtons.html(objButtons.html().replace(/button/g, 'a'));
		objButtons.html(objButtons.html().replace(/type=submit/g, ''));
		objButtons.html(objButtons.html().replace('/hopscotch-next/g"', 'hopscotch-next" href="javascript:void(0);"'));
		objButtons.html(objButtons.html().replace('/hopscotch-prev/g"', 'hopscotch-prev" href="javascript:void(0);"'));
		if (objButtons.find('.grid-col4 .hopscotch-prev').length == 0) {
			objButtons.find('.hopscotch-prev').wrap('<div class="grid-col4 txt-bold left"></div>');
			objButtons.find('.hopscotch-prev').attr("href","javascript:void(0);").attr("title","Voltar");
		}
		objButtons.find('.hopscotch-prev').addClass('btn btn-secundario left cursor-pointer');
		if (objButtons.find('.grid-col4 .hopscotch-skip').length == 0) {
			$(btnSkip).wrap('<div class="margem-cima10"></div>');
			objButtons.append(btnSkip);
			$('.grid-col3 .hopscotch-skip').on('click', function(evt) {
				$('.hopscotch-bubble-close.hopscotch-close').click();
			});
		}
		if (objButtons.find('.grid-col3 .hopscotch-next').length == 0) {
			objButtons.find('.hopscotch-next').wrap('<div class="grid-col3 right"></div>');
			objButtons.find('.hopscotch-next').attr("href","javascript:void(0);").attr("title","Proximo");
		}
		objButtons.find('.hopscotch-next').addClass('btn btn-fluxo right cursor-pointer');
		if ($('.hopscotch-content').find('.hopscotch-bullets').length == 0) {
			thisClass._criaBullets(objButtons);
		}
		if (objButtons.find('.grid-col12 .hopscotch-done').length == 0) {
			objButtons.append(btnDone);
			$('.grid-col12 .hopscotch-done').on('click', function() {
				$('.hopscotch-bubble-close.hopscotch-close').click();
			});
		}
		if (objButtons.find('.grid-row').lenght == 0) {
			objButtons.wrap('<div class="grid-row"></div>');
		}
		thisClass._atualizaBotoes();
		$("#divOverlayHopscotch").show(500);
		$('.hopscotch-bubble-container').addClass('hopscotch-cta');

		//acessibilidade - inicio
		if($('.hopscotch-content').find('.element-access-hide').length == 0){ 
			var textoAcessivel = $('.hopscotch-content').text();
		}else{
			var textoAcessivel = $('.hopscotch-content').find('.element-access-hide').text();
		}
		$("#divAcessTour").remove();
		
		var contInterno ='<div id="divAcessTour" aria-labelledby="pAcessTour" tabindex="-1">'; 
		contInterno +='<p id="pAcessTour" tabindex="-1" class="element-access-hide">'+ textoAcessivel + '</p></div>';

		$('.hopscotch-bubble').prepend(contInterno);
		setTimeout(function() {
			$('#divAcessTour').focus();
		}, 500);
		if(thisClass.onCompleteMontarTela){				
			thisClass.onCompleteMontarTela();
		}
		//acessibilidade - fim
		if(thisClass.onDismiss){
			$('.hopscotch-close').on('click',function(){
				thisClass.onDismiss();
			});
		}
	},

	_criaBullets: function(objButtons) {
		var thisClass = this;
		$('.hopscotch-content').append('<div class="hopscotch-bullets"></div>');
		$('.hopscotch-bullets').append('<ul class="fluxo-passo-a-passo padding-baixo15"></ul>');
		for (iLoop = 0; iLoop < thisClass._intro.getCurrTour().steps.length; ++iLoop) {
			$('.hopscotch-bullets .fluxo-passo-a-passo').append('<li><a href="javascript:void(0);" id="hsStep' + iLoop + '_" class="cursor-pointer"></a></li>');
			var obj = $('#hsStep' + iLoop + '_');
			if (iLoop == thisClass._intro.getCurrStepNum()) {
				$(obj).addClass('ativo');
			}
		}
	},

	_atualizaSteps: function() {
		var thisClass = this;
		for (iLoop = 0; iLoop < thisClass._intro.getCurrTour().steps.length; ++iLoop) {
			var step = thisClass._intro.getCurrTour().steps[iLoop];
			if (step.target == '#idDivCenter' && iLoop == thisClass._intro.getCurrStepNum()) {
				$('.hopscotch-bubble-arrow-container').addClass('hidden');
			}
			step.onShow = function() {
				for (iLoop = 0; iLoop < thisClass._intro.getCurrTour().steps.length; ++iLoop) {
					var eleOld = thisClass._arEleOld[iLoop];
					var step = thisClass._intro.getCurrTour().steps[iLoop];
					$(step.target).removeClass('hopscotch-target');
				}
				var stepCur = thisClass._intro.getCurrTour().steps[thisClass._intro.getCurrStepNum()];
				if (stepCur.target != "#idDivCenter") {
					$(stepCur.target).addClass('hopscotch-target');
				}
				if (thisClass.onChangeTour && controlePosTour != thisClass._intro.getCurrStepNum()) {
					thisClass.onChangeTour(thisClass._intro.getCurrStepNum());
					controlePosTour = thisClass._intro.getCurrStepNum();
					var arElementos = thisClass._elementos;
					var controlePosElem = arElementos[thisClass._intro.getCurrStepNum()].posicao;
					if(controlePosElem == "top"){
						configuraPaddingTour = $('.hopscotch-bullets').find('[class*="padding-baixo"]').css('padding-bottom');
						configuraPaddingTour = parseFloat(configuraPaddingTour);
						$('.hopscotch-bubble').css('top','-='+(configuraPaddingTour+=15));
						//console.log(configuraPaddingTour);
					}else if(controlePosElem == "left"){
						var elemento = $(arElementos[thisClass._intro.getCurrStepNum()].elemento);
						var left = elemento.offset().left - 370; 
						$('.hopscotch-bubble').css('left',left + "px");
					}
					if(arElementos[thisClass._intro.getCurrStepNum()].fixed){
						$('.hopscotch-bubble').css('position','fixed');
					}else{
						$('.hopscotch-bubble').css('position','absolute');
					}
					
				}
			};
		}
	},

	atualizaPassoInfo : function(){
		var thisClass = this;
		$('.hopscotch-prev').parent().removeClass('hidden');
		$('.hopscotch-bullets').removeClass('hidden');
		$('.hopscotch-next').parent().removeClass('hidden');
		// As duas linhas abaixo foram adicionadas para deixar os passos anteriores marcados
		ativo = $(".hopscotch-bullets .fluxo-passo-a-passo li a.ativo");
		ativo.addClass("ativo").parent("li").prevAll().find("a").addClass("ativo");
		// remover alterações realizadas pelo tour ibba
		$('.bg-tour1').css("height", "");
		$("div.bg-tour1").css("background","");
		$('.hopscotch-nav-a.next.hopscotch-next.btn.btn-fluxo').removeClass('btn-tour1');	
		$(".hopscotch-nav-a.next.hopscotch-next.btn.btn-fluxo.right.cursor-pointer").text(thisClass.btnDoneTxt);
		// fim
		$('.hopscotch-bubble').removeClass('bg-tour1');;
		$('.hopscotch-bubble-container').removeClass('bg-container-tour1');
		$('.header-tour1').removeClass('grid-col12');
		$('.header-tour1').addClass('grid-col11');
		$('.hopscotch-bubble-container').css('width', '350px');
		$('.hopscotch-bubble-container').css('padding', '15px');
	},

	escondeElementos : function(){
		$('.hopscotch-skip').parent().addClass('hidden');
		$('.hopscotch-bullets').addClass('hidden');
		$('.hopscotch-prev').parent().addClass('hidden');
		$('.hopscotch-next').parent().addClass('hidden');
		$('.hopscotch-done').parent().addClass('hidden');	
	},

	_atualizaBotoes: function() {
		var thisClass = this;
		this.escondeElementos();
		if (thisClass._intro.getCurrStepNum() == 0) {
			$('.hopscotch-skip').parent().removeClass('hidden');
			$('.hopscotch-bullets').removeClass('hidden');
			$('.hopscotch-next').parent().removeClass('hidden');
			$('.hopscotch-bubble').addClass('bg-tour1');
			$('.hopscotch-nav-a.next.hopscotch-next.btn.btn-fluxo').addClass('btn-tour1');
			//$('.hopscotch-bubble-container').css('width', '550px');
			$('.hopscotch-bubble-container').removeAttr( 'style' );
			$('.hopscotch-bubble-container').addClass('bg-container-tour1');
			$('.header-tour1').removeClass('grid-col11');
			$('.header-tour1').addClass('grid-col12');
		} else if (thisClass._intro.getCurrTour().steps.length - 1 == thisClass._intro.getCurrStepNum()) {
			this.atualizaPassoInfo();
			this.escondeElementos();
			$('.hopscotch-done').parent().removeClass('hidden');
			$('.hopscotch-bubble').removeClass('bgtour1');
			$('.hopscotch-nav-a.next.hopscotch-next.btn.btn-fluxo').removeClass('btn-tour1');	
			$('.hopscotch-bubble-container').removeClass('bg-container-tour1');
			$('.header-tour1').removeClass('grid-col12');
			$('.header-tour1').addClass('grid-col11');
			$('.hopscotch-bubble-container').css('width', '350px');
			$('.hopscotch-bubble-container').css('padding', '15px');
		} else {
			this.atualizaPassoInfo();
		}
		setTimeout(function() {
			thisClass._atualizaSteps();
		}, 100);
		$(".hopscotch-next").click(function(){
			setTimeout(function(){
				thisClass._intro.startTour(thisClass._intro.getCurrTour(), thisClass.getCurrentStep() - 1);
			}, 50);
		});
		$(".hopscotch-prev").click(function(){
			setTimeout(function(){
				thisClass._intro.startTour(thisClass._intro.getCurrTour(), thisClass.getCurrentStep() - 1);
			}, 50);
		});
		$('.hopscotch-bullets .fluxo-passo-a-passo li a').click(function(evt) {
			try {
				var valor = this.id.substring(this.id.indexOf('hsStep') + 6, this.id.indexOf('_'));
			} catch (e) {
				var valor = "0";
			}
			if(thisClass.onChangeTour){
				thisClass.onChangeTour(parseInt(valor));
			}
			thisClass._intro.startTour(thisClass._intro.getCurrTour(), parseInt(valor));
			evt.stopPropagation();
		});
		
		thisClass._acessibilidadeTour();
	},

	_acessibilidadeTour: function() {
		var couchMarkPassos = $('.fluxo-passo-a-passo li');
		var totalPassos = couchMarkPassos.length;
		//totalPassos
		var i = 1;
		$(couchMarkPassos).each(function() {
			if(i == tourElements.getCurrentStep()){
				$(this).find('a').attr('title','Passo '+i+' de '+ totalPassos + ' ativo');
			}else{
				$(this).find('a').attr('title','Passo '+i+' de '+ totalPassos);
			}
			
			i++;
		});
	},

	_finalizaTour: function() {
		var thisClass = this;
		$(document).unbind("keyup.coachmark");
		for (iLoop = 0; iLoop < thisClass._intro.getCurrTour().steps.length; ++iLoop) {
			var eleOld = thisClass._arEleOld[iLoop];
			var step = thisClass._intro.getCurrTour().steps[iLoop];
			$(step.target).removeClass('hopscotch-target');
		}
		$('#idDivCenter').hide();
		$('#idDivCenter').remove();
		$('#divOverlayHopscotch').hide(1000);
		$('#divOverlayHopscotch').remove();
		if (thisClass.onExitTour) {
			thisClass.onExitTour();
		}
	}
}
/* ==============================================================================================
* APP_COACHMARK
* 
*
* Data: 04 Abril 2017
*
* 
* Versao 1.0.3
*
* =============================================================================================== */
var tourElementsApp = {
	btnNextTxt: "Próximo",
	btnPrevTxt: "Voltar",
	btnSkipTxt: "Não, obrigado",
	btnDoneTxt: "Ok, entendi",
	showNumber: false,
	bullets: true,
	_clickBubble : false,
	_seeAgainControl: null,
	_arEleOld: new Array(),
	_lastStepNum: -1,
	_elementoRec: null,
	_elementos: new Array(),
	_tour: null,
	onChangeTour: undefined,
	onEnterTour: undefined,
	onExitTour: undefined,
	onDismiss:undefined,

	getCurrentStep: function() {
		var thisClass = this;
		return thisClass._intro.getCurrStepNum() + 1;
	},

	getIntro: function() {
		return hopscotch;
	},

	addElements: function(elemento, descricao, posicao) {
		
		var thisClass = this;
		thisClass._elementoRec = new function() {
			elemento, descricao, posicao
		};
		thisClass._elementoRec.elemento = elemento;
		thisClass._elementoRec.descricao = descricao;
		thisClass._elementoRec.posicao = posicao;
		thisClass._elementos[this._elementos.length] = this._elementoRec;
		
	},

	clearElements: function() {
		var thisClass = this;
		thisClass._elementos = new Array()
	},
	
	
	_intro: hopscotch,

	show: function() {
		var thisClass = this;
		thisClass._init();
		thisClass._start();
	},

	_init: function() {
		var thisClass = this;
		thisClass._tour = {
			id: 'hello-hopscotch',
			i18n: {
				nextBtn : thisClass.btnNextTxt,
				prevBtn : thisClass.btnPrevTxt,
				doneBtn : thisClass.btnDoneTxt,
				skipBtn : thisClass.btnSkipTxt
			},
			steps: thisClass._montaJSONTour(),
			showPrevButton: true,
			scrollTopMargin: 100,
			bubbleWidth: 400,
			skipIfNoElement: false,
			onStart: function() {
				setTimeout(function() {
					thisClass._montaTelaIntro();
					if (thisClass.onEnterTour) {
						thisClass.onEnterTour();
					}
				}, 0);
			},
			onClose: function() {
				thisClass._finalizaTour()
			}
		}
	},

	_start: function() {
		var thisClass = this;
		thisClass._intro.startTour(thisClass._tour, 0);
	},

	_montaJSONTour: function() {
		
		var thisClass = this;
		var arElementos = thisClass._elementos;
		var strElemento = "";
		var step = "";
		
		var divCenter = '<div id="idDivCenter" style="opacity: 0; width: 10px; height: 10px; position: fixed; top: ' + ($('body').height() / 2 - 5) + 'px; left: ' + ($('body').width() / 2 - 5) + 'px;"></div>';
		if ($('body').find('#idDivCenter').length == 0) {
			$('body').append(divCenter);
		}
		
		for (var iLoop = 0; iLoop < arElementos.length; ++iLoop) {
			if (arElementos[iLoop].elemento === null) {
				thisClass._arEleOld[thisClass._arEleOld.length] = $("#idDivCenter");
				strElemento += '{"target" : "#idDivCenter",';
				strElemento += '"content" : "' + arElementos[iLoop].descricao.replace(/\"/g, "\'") + '",';
				strElemento += '"xOffset" : "-195px",';
				strElemento += '"yOffset" : "center",';
				
				if (arElementos[iLoop].posicao === null) {
					strElemento += '"placement" : "bottom"}';
				} else {
					strElemento += '"placement" : "' + arElementos[iLoop].posicao + '"}';
				}
			} else {
				thisClass._arEleOld[thisClass._arEleOld.length] = $(arElementos[iLoop].elemento).clone();
				strElemento += '{"target" : "' + arElementos[iLoop].elemento + '",';
				strElemento += '"content" : "' + arElementos[iLoop].descricao.replace(/\"/g, "\'") + '",';

				if (arElementos[iLoop].posicao === null) {
					strElemento += '"placement" : "top"}';
				} else {
					strElemento += '"placement" : "'+ arElementos[iLoop].posicao + '"}';
				}
			}
			if (iLoop != arElementos.length - 1) {
				strElemento += ',\n';
			} else {
				strElemento += '\n';
			}
		}
		step = "[" + strElemento + "]";
		return JSON.parse(step);
	},

	_retornaPath: function() {
		var thisClass = this;
		var strAuxPk = "";
		listaScripts = $('script');
		for (iLoop = 0; iLoop < listaScripts.length; ++iLoop) {
			strAuxPk = $(listaScripts[iLoop]).attr('src');
			if (strAuxPk != null) {
				if (strAuxPk.indexOf('summer-cdn') >= 0) {
					if (strAuxPk.indexOf('http\:\/\/') >= 0) {
						strAuxPk = strAuxPk.substring(0, strAuxPk.indexOf('summer-cdn') + 'summer-cdn'.length);
					} else {
						strAuxPk = strAuxPk.substring(0, strAuxPk.indexOf('summer-cdn') + 'summer-cdn'.length) + '\/WebContent\/';
					}
				}
				return strAuxPk;
			}
		}
	},

	_montaTelaIntro: function() {
		var thisClass = this;
		var objBullet = "";
		var objButtons;
		var overLay = '<div class="hopscotch-overlay" id="divOverlayHopscotch"></div>';
		var header = '<div class="grid-row"><div class="grid-col11"><span id="fecharTourElements" class="hopscotch-close fechar" title="Fechar mensagem"><a href="#" id="fecharTourElements">Fechar mensagem</a></span></div></div>';
		var btnSkip = '<div class="grid-col3 left"><a href="javascript:void(0);" class="hopscotch-nav-a skip hopscotch-skip hopscotch-close left margem-cima10">' + thisClass.btnSkipTxt + '</a></div>';
		var btnDone = '<div class="grid-col12 center"><a href="javascript:void(0);" class="hopscotch-nav-a skip hopscotch-done hopscotch-close btn btn-fluxo">' + thisClass.btnDoneTxt + '</a></div>';
		
		if ($('body').find('#divOverlayHopscotch').length == 0) {
			$('body').append(overLay);
			
		}
		
		
		if (!$('.hopscotch-bubble').hasClass('content-config-helps')) {
			$('.hopscotch-bubble').addClass('content-config-helps');
		}
		
					
		if (thisClass.showNumber == false) {
			$('.hopscotch-bubble-number').remove();
		}
		objButtons = $('.hopscotch-actions');
		$('.hopscotch-bubble-close.hopscotch-close').addClass('hide');
		if ($('.grid-col11 .hopscotch-close.fechar').length == 0) {
			$('.hopscotch-content').before(header);
			$('.grid-col11 .hopscotch-close.fechar').on('click', function(evt) {
				$('.hopscotch-bubble-close.hopscotch-close').click();
			});
		}
		
			
		objButtons.addClass('grid-row');
		objButtons.html(objButtons.html().replace(/BUTTON/g, 'A'));
		objButtons.html(objButtons.html().replace(/button/g, 'a'));
		objButtons.html(objButtons.html().replace(/type=submit/g, ''));
		objButtons.html(objButtons.html().replace('/hopscotch-next/g"', 'hopscotch-next" href="javascript:void(0);"'));
		objButtons.html(objButtons.html().replace('/hopscotch-prev/g"', 'hopscotch-prev" href="javascript:void(0);"'));
		
		if (objButtons.find('.grid-col3 .hopscotch-prev').length == 0) {
			objButtons.find('.hopscotch-prev').wrap('<div class="grid-col3 left"></div>');
			objButtons.find('.hopscotch-prev').attr("href","javascript:void(0);").attr("title","Voltar");
		}
		objButtons.find('.hopscotch-prev').addClass('btn btn-secundario left cursor-pointer');
		if (objButtons.find('.grid-col3 .hopscotch-skip').length == 0) {
			$(btnSkip).wrap('<div class="margem-cima10"></div>');
			objButtons.append(btnSkip);
			$('.grid-col3 .hopscotch-skip').on('click', function(evt) {
				$('.hopscotch-bubble-close.hopscotch-close').click();
			});
		}
		if (objButtons.find('.grid-col3 .hopscotch-next').length == 0) {
			objButtons.find('.hopscotch-next').wrap('<div class="grid-col3 right"></div>');
			objButtons.find('.hopscotch-next').attr("href","javascript:void(0);").attr("title","Proximo");
		}
		
		objButtons.find('.hopscotch-next').addClass('btn btn-fluxo right cursor-pointer');
		
		if ($('.hopscotch-content').find('.hopscotch-bullets').length == 0) {
			thisClass._criaBullets(objButtons);
		}
		
		if (objButtons.find('.grid-col12 .hopscotch-done').length == 0) {
			objButtons.append(btnDone);
			$('.grid-col12 .hopscotch-done').on('click', function() {
				$('.hopscotch-bubble-close.hopscotch-close').click();
			});
		}
		if (objButtons.find('.grid-row').lenght == 0) {
			objButtons.wrap('<div class="grid-row"></div>');
		}		
				
		thisClass._atualizaBotoes();
	
		thisClass._resizeModal();
		
		thisClass._seeAgain();
		
		thisClass._moveModalTour(thisClass._returnValuePosition());
						
				
		//acessibilidade - inicio
		if($('.hopscotch-content').find('.element-access-hide').length == 0){ 
			var textoAcessivel = $('.hopscotch-content').text();
		}else{
			var textoAcessivel = $('.hopscotch-content').find('.element-access-hide').text();
		}
		$("#divAcessTour").remove();
		
		var contInterno ='<div id="divAcessTour" role="alert" aria-labelledby="pAcessTour" tabindex="-1">'; 
		contInterno +='<p id="pAcessTour" tabindex="-1" class="element-access-hide">'+ textoAcessivel + '</p></div>';

		$('.hopscotch-bubble').prepend(contInterno);

		
		setTimeout(function() {
			$('#divAcessTour').focus();
		}, 500);
		//acessibilidade - fim
		
		if(thisClass.onDismiss){
			$('.hopscotch-close').on('click',function(){
				thisClass.onDismiss();
			});
		}
	},

	_criaBullets: function(objButtons) {
		var thisClass = this;
		$('.hopscotch-content').append('<div class="hopscotch-bullets"></div>');
		$('.hopscotch-bullets').append('<ul class="fluxo-passo-a-passo padding-baixo15"></ul>');
		for (iLoop = 0; iLoop < thisClass._intro.getCurrTour().steps.length; ++iLoop) {
			$('.hopscotch-bullets .fluxo-passo-a-passo').append('<li><a id="hsStep' + iLoop + '_" class="cursor-pointer"></a></li>');
			var obj = $('#hsStep' + iLoop + '_');
			if (iLoop == thisClass._intro.getCurrStepNum()) {
				$(obj).addClass('ativo');
			}
		}
	},

	_atualizaSteps: function() {
	
		var thisClass = this;
		
		for (iLoop = 0; iLoop < thisClass._intro.getCurrTour().steps.length; ++iLoop) {
				
			var step = thisClass._intro.getCurrTour().steps[iLoop];
			if (step.target == '#idDivCenter' && iLoop == thisClass._intro.getCurrStepNum()) {
				$('.hopscotch-bubble-arrow-container').addClass('hidden');
			}
			
			step.onShow = function() {
				thisClass._montaTelaIntro();
				for (iLoop = 0; iLoop < thisClass._intro.getCurrTour().steps.length; ++iLoop) {
					var eleOld = thisClass._arEleOld[iLoop];
					var step = thisClass._intro.getCurrTour().steps[iLoop];
					$(step.target).removeClass('hopscotch-target');
				}
				var stepCur = thisClass._intro.getCurrTour().steps[thisClass._intro.getCurrStepNum()];
				if (stepCur.target != "#idDivCenter") {
					$(stepCur.target).addClass('hopscotch-target');
				}
				if (thisClass.onChangeTour && controlePosTour != thisClass._intro.getCurrStepNum()) {
			
					thisClass.onChangeTour(thisClass._intro.getCurrStepNum());
					controlePosTour = thisClass._intro.getCurrStepNum();
					
					var arElementos = thisClass._elementos;
					var controlePosElem = arElementos[thisClass._intro.getCurrStepNum()].posicao;
					if(controlePosElem == "top"){
						configuraPaddingTour = $('.hopscotch-bullets').find('[class*="padding-baixo"]').css('padding-bottom');
						configuraPaddingTour = parseFloat(configuraPaddingTour);
						$('.hopscotch-bubble').css('top','-='+(configuraPaddingTour+=15));
					}
				}
			};
		}
	},

	_atualizaBotoes: function() {
		var thisClass = this;
		
		
		thisClass._hideArrow();
		$('.hopscotch-skip').parent().addClass('hidden');
		$('.hopscotch-bullets').addClass('hidden');
		$('.hopscotch-prev').parent().addClass('hidden');
		$('.hopscotch-next').parent().addClass('hidden');
		$('.hopscotch-done').parent().addClass('hidden');
		
				
		if (thisClass._intro.getCurrStepNum() == 0) {
			$('.hopscotch-skip').parent().removeClass('hidden');
			$('.hopscotch-bullets').removeClass('hidden');
			$('.hopscotch-next').parent().removeClass('hidden');
		} else if (thisClass._intro.getCurrTour().steps.length - 1 == thisClass._intro.getCurrStepNum()) {
			$('.hopscotch-done').parent().removeClass('hidden');
		} else {
			$('.hopscotch-prev').parent().removeClass('hidden');
			$('.hopscotch-bullets').removeClass('hidden');
			$('.hopscotch-next').parent().removeClass('hidden');
			// As duas linhas abaixo foram adicionadas para deixar os passos anteriores marcados
			ativo = $(".hopscotch-bullets .fluxo-passo-a-passo li a.ativo");
			ativo.addClass("ativo").parent("li").prevAll().find("a").addClass("ativo");
		}
		setTimeout(function() {
			thisClass._atualizaSteps();
		}, 100);
		$('.hopscotch-bullets .fluxo-passo-a-passo li a').click(function(evt) {
			try {
				var valor = this.id.substring(this.id.indexOf('hsStep') + 6, this.id.indexOf('_'));
			} catch (e) {
				var valor = "0";
				alert("acessibilidade");
			}
			thisClass._intro.startTour(thisClass._intro.getCurrTour(), parseInt(valor));
			evt.stopPropagation();
		});
		
		thisClass._acessibilidadeTour();
	},

	_acessibilidadeTour: function() {
		var couchMarkPassos = $('.fluxo-passo-a-passo li');
		var totalPassos = couchMarkPassos.length;
		//totalPassos
		var i = 1;
		
		$(couchMarkPassos).each(function() {
			if(i == tourElementsApp.getCurrentStep()){
				$(this).find('a').attr('title','Passo '+i+' de '+ totalPassos + ' ativo');
			}else{
				$(this).find('a').attr('title','Passo '+i+' de '+ totalPassos);
			}
			
			i++;
		});
	},
	
	_moveModalTour : function(valueLeft){
		$('.hopscotch-bubble').css('top', '80');
		$('.hopscotch-bubble').css('left', valueLeft + 'px');
	},
	
	_returnValuePosition : function(){
		
		var thisClass = this;
		$returnValueLeft = 0;
		
		if (thisClass._intro.getCurrStepNum() != undefined) {
			//$elementoLeft = $('.fluxo-passo-a-passo').parent().parent().parent().parent().parent().position();
			$elementoLeft = $('#idDivCenter').position();
			$returnValueLeft = $elementoLeft.left - 240;
		}
		return $returnValueLeft;
	},
		
	
	_resizeModal : function(){
		var thisClass = this;
		$("#divOverlayHopscotch").show(500);
		$('.hopscotch-bubble-container').addClass('hopscotch-cta');
		$('.hopscotch-bubble-container').css('width', '510px');
		$('.hopscotch-bubble-container').css('padding', '20');
	},
	
	_seeAgain : function(){
		var thisClass = this;
		var countModal = thisClass._intro.getCurrStepNum();
		var btnOkEntendi = $('.hopscotch-done').parent();
		
		if(countModal === 3){
		
			$('.hopscotch-prev').parent().removeClass('hidden');
			$('.hopscotch-prev').html('ver novamente');
			$('.hopscotch-prev').attr('title', 'ver novamente');
			$('.hopscotch-prev').css('white-space', 'nowrap');
			
			btnOkEntendi.removeClass('grid-col12 center');
			btnOkEntendi.addClass('grid-col3 right');
			btnOkEntendi.css('margin-top', '10px');
			btnOkEntendi.css('margin-right', '-34px');
			
			
			thisClass._clearBtnEn();
			
			$('.hopscotch-prev').click(function(evt){
				thisClass._backFirstModal(evt);
			
			});	
		}
	},
	
	_clearBtnEn : function(){
		$btnEntendi = $('.hopscotch-done');
		if($btnEntendi.length > 1){
			$btnEntendi.parent().hide();
			$btnEntendi.eq(0).parent().show();
		}	
	},
	
	_backFirstModal : function(evt){
		var thisClass = this;
		thisClass._intro.startTour(thisClass._tour, 0);
		evt.stopPropagation();
	},
	
	_hideArrow : function(){
		$('.hopscotch-arrow').hide();
	},
	
	_finalizaTour: function() {
		var thisClass = this;
		for (iLoop = 0; iLoop < thisClass._intro.getCurrTour().steps.length; ++iLoop) {
			var eleOld = thisClass._arEleOld[iLoop];
			var step = thisClass._intro.getCurrTour().steps[iLoop];
			$(step.target).removeClass('hopscotch-target');
		}
		$('#idDivCenter').hide();
		$('#idDivCenter').remove();
		$('#divOverlayHopscotch').hide(1000);
		$('#divOverlayHopscotch').remove();
		if (thisClass.onExitTour) {
			thisClass.onExitTour();
		}
	}
}
/* ==============================================================================================
* calendarioFixo: Calendário fixo na tela
*
* Descrição: Tela de espera personalizado
*
* Autor: Itau-Unibanco
*
* Data: 29 Dez 2014
*
* Exemplo de uso: colunasCalendario.posicaoIcones  = 'left';
		          colunasCalendario.funcaoSelect = function () {minhaFuncao()};
		          colunasCalendario.altura = '350px';
		          colunasCalendario.show();
*
* Dependencia js: jQuery 1.7 ou maior,
*                 pikaday.js
*
* Dependencia CSS: itau-style.css ( usado na borda da modal  )
*
* Versao 1.0.1
*
******************************************************************************************
***** ALTERACOES *************************************************************************
******************************************************************************************
*   20160317-AJUSTE PARA EXECUTAR O CLICK DOS DIAS.
* =============================================================================================== */
var CalendarioFixoHelper = {
	parseJSON : function(json) {
		try{
			return {
				data : $.parseJSON(json),
				status : true
			}
		} catch(e){
			if(console && json.length > 0){
				console.log(e);
			}
			return {
				data : [],
				status : false
			}
		}
	}
};

var linhasCalendario;
var colunasCalendario;
var calendarioFixo = {
container     : null,
funcaoSelect  : null,
funcaoDraw    : null,
lista         : null,
legendaPf	  : false,
posicaoIcones : 'bottom',
altura        : '300px',
_init : function () {
	var thisClass = this;
	if (thisClass.container != null) {
		thisClass._configuraPikaday ();
	}
	else {
		var calendars = $(".fixedCalendar")
		$.each(calendars,function (index) {
			thisClass.container = calendars[index];
			thisClass._configuraPikaday();
		});
	}
	if (!$('#idCalendarioFixoStyle').length) {
		$("head").append(this.montaCssCalendarioFixo());
	}
	var result = CalendarioFixoHelper.parseJSON(thisClass.lista);
	if(result.status){
		thisClass._pikadayDraw(result.data);
	}
},
_pikadayDraw : function (data) {
	var thisClass = this;
	var pikaButtons = $(thisClass.container).find('.pika-button');
	var floatButtons;
	var floatTxt;
	var whButtons;
	var txtBtn = "";
	var divImg = "";
	$(pikaButtons).find('.pikaday-imagens-status').remove();
	if (thisClass.posicaoIcones == 'right' || thisClass.posicaoIcones == 'left') {
		whButtons = "width:50%; height:100%;";
		txtBtn = "style='position: relative;top:27%'";
		if (thisClass.posicaoIcones == 'right') {
			floatButtons = " right";
			floatTxt = " left";
			divImg = ' style="height:33.3333%" ';
		}
		else {
			floatButtons = ' left';
			floatTxt = " right";
			divImg = ' style="height:33.3333%" ';
		}
	}
	if (thisClass.posicaoIcones == 'top' || thisClass.posicaoIcones == 'bottom') {
		floatButtons = '';
		whButtons = "height:50%;width:100%;";
		floatTxt = '';
		if (thisClass.posicaoIcones == 'right') {
			floatButtons = " right";
			floatTxt = " left";
			divImg = ' style="width:33.3333%;float:left" ';
		}
		else {
			floatButtons = ' left';
			floatTxt = " right";
			divImg = ' style="width:33.3333%;float:right" ';
		}

	}

	$.each(pikaButtons,function (index) {
		var pikaBtn = pikaButtons[index];
		var pikaBtnHtml = "<div style='"+ whButtons + "' class='data-now "+ floatTxt + "'><span "+ txtBtn + "><strong class='text-access-hide'>Dia </strong>" + $(pikaBtn).text() + "</span><div class='circulo-is-today'></div></div>";
		var classBtnImg1 = "";
		var classBtnImg2 = "";
		var classBtnImg3 = "";
		if (thisClass.posicaoIcones == 'right' || thisClass.posicaoIcones == 'left') {
			if (linhasCalendario/3 < 14) {
				classBtnImg1 = "icone-pago-pp ";
				classBtnImg2 = "icone-agendamento-pp ";
				classBtnImg3 = "icone-boleto-pp ";
			}
			else if (linhasCalendario/3 >=14 && linhasCalendario/3 < 18) {
				classBtnImg1 = "icone-pago-p ";
				classBtnImg2 = "icone-agendamento-p ";
				classBtnImg3 = "icone-boleto-p ";
			}
			else {
				classBtnImg1 = "icone-pago ";
				classBtnImg2 = "icone-agendamento ";
				classBtnImg3 = "icone-boleto ";
			}
		}
		else {
			if (colunasCalendario/3 < 13) {
				classBtnImg1 = "icone-pago-pp ";
				classBtnImg2 = "icone-agendamento-pp ";
				classBtnImg3 = "icone-boleto-pp ";
			}
			else if (colunasCalendario/3 >=13 && colunasCalendario/3 < 16) {
				classBtnImg1 = "icone-pago-p ";
				classBtnImg2 = "icone-agendamento-p ";
				classBtnImg3 = "icone-boleto-p ";
			}
			else {
				classBtnImg1 = "icone-pago ";
				classBtnImg2 = "icone-agendamento ";
				classBtnImg3 = "icone-boleto ";
			}
		}

		var img = '';
		var img1 = '<div ' + divImg + '><span class="'+ classBtnImg1 + ' txt-v-align-middle" style="top: 5px;" aria-label="Agendamentos e Débito Automático">Agendamentos e Débito Automático</span></div>';
		var img2 = '<div ' + divImg + '><span class="'+ classBtnImg2 + ' txt-v-align-middle" style="top: 5px;" aria-label="Boletos emitidos pelo Itaú Pendentes">Boletos emitidos pelo Itaú Pendentes</span></div>';
		var img3 = '<div ' + divImg + '><span class="'+ classBtnImg3 + ' txt-v-align-middle" style="top: 5px;" aria-label="Pago - Comprovantes">Pago - Comprovantes</span></div>';
		var img4 = '<div aria-label="vencidos" class="calendario-flag-red"></div>'; // V (pagamentos vencidos )
		var img5 = '<div aria-label="pendências, agendamentos e/ou realizados" class="calendario-rectangle"></div>'; // A (pendências, agendamentos e/ou realizados )
		var imgSemIcon  = '<div></div>';

		if (data != null) {
				var valores=thisClass._retornaOpcoes($(pikaBtn).text());
				if (valores) {
					if (valores.indexOf("P")>=0) {
						img = img + img1;
					}
					if (valores.indexOf("A")>=0) {
						img = img + img2;
					}
					if (valores.indexOf("B")>=0) {
						img = img + img3;
					}
					if (valores.indexOf("V")>=0) {
						img = img + img4;
					}
					if (valores.indexOf("N")>=0) {
						img = img + img5;
					}
				}
		}
		if (img=="") {
			img = imgSemIcon;
			img = "<div style='"+ whButtons + "' class='pikaday-imagens-status no-icon "+ floatButtons + "'>" + img + "</div>";
		}
		else {
			img = "<div style='"+ whButtons + "' class='pikaday-imagens-status "+ floatButtons + "'>" + img + "</div>";
		}
		if (thisClass.posicaoIcones == 'top') {
			$(pikaBtn).html(img + pikaBtnHtml);
		}
		if (thisClass.posicaoIcones != 'top') {
			$(pikaBtn).html(pikaBtnHtml + img);
		}
		//20160317-AJUSTE PARA EXECUTAR O CLICK DOS DIAS.
		$(pikaBtn).children().on("click",function(){
			var el = $(pikaBtn)[0];
			var ev;
			var eventName = "mousedown";
			if (document.createEvent) {
				ev = document.createEvent('HTMLEvents');
				ev.initEvent(eventName, true, false);
				el.dispatchEvent(ev);
			} else if (document.createEventObject) {
				ev = document.createEventObject();
				el.fireEvent('on' + eventName, ev);
			}
		});

		//AJUSTE para aparecer a legenda
		if(calendarioFixo.legendaPf){
			$(".legendaCalendario").remove();
			$('.pika-single:first').after("<div class='pika-single-baixo legendaCalendario'><div class='calendario-rectangle-big'></div><p class='margem-baixo10'>pendências, agendamentos e/ou realizados</p><div class='calendario-flag-red-big'></div><p>vencidos</p></div>");
		}
	});
	
	
},
_configuraPikaday : function () {
	var thisClass = this;
	$(thisClass.container).parent().append ("<input id='dtpicker' type='text' value='' class='mask-data' placeholder='dd/mm/aaaa' style='display:none'>");
	 $("#dtpicker").pikaday({
			firstDay: 1,
			minDate: new Date('2000-01-01'),
			maxDate: new Date('2020-12-31'),
			yearRange: [2000,2020],
			i18n: {
				previousMonth : 'Mês anterior',
				nextMonth     : 'Próximo mês',
				months        : ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
				weekdays      : ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
				weekdaysShort : ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
			},
			bound: false,
			container: $(thisClass.container)[0],
			onDraw: function () {
				if (thisClass.funcaoDraw != null) {
					thisClass.funcaoDraw ();
				}
				var result = CalendarioFixoHelper.parseJSON(thisClass.lista);
				if(result.status){
					thisClass._pikadayDraw(result.data);
				}
				$( ".pika-label-mes, .pika-label-ano" ).on( "click", function() {
					if( typeof clickMesEAno == 'function'){
						clickMesEAno();
					}
					$(".pika-label-mes, .pika-label-ano"); // adiciona marcação no mes/ano
					$(".pika-table .is-selected").removeClass("is-selected"); // remove marcação do dia

				});
			},
			onSelect: function () {if (thisClass.funcaoSelect) {thisClass.funcaoSelect ();}}
		});
},
montaCssCalendarioFixo : function  () {
	var thisClass = this;
	var path = thisClass._retornaPath();
	//var path = "https://jarvisfabrica.itau/estatico/release/summer-cdn";
	var aux;

	if (thisClass.altura.indexOf ("%")>= 0) {
		linhasCalendario = ((($(thisClass.container).height()-33) / 7)-2);
	}
	else {
		aux = thisClass.altura.substring (0,thisClass.altura.length-2);
		linhasCalendario = (((aux-33) / 7)-2);
	}
	if ($('.pika-single').height()<=0) {
		colunasCalendario = 300/7;
	}
	else {
		colunasCalendario = $('.pika-single').height()/7;
	}

	var cssClass =  "<style id='idCalendarioFixoStyle' type='text/css'>";
	cssClass = cssClass +  ".calendario-fixo .pika-title {width:100%;height:33px;}\n";
	cssClass = cssClass +  ".calendario-fixo .pika-lendar {width:100%;height:"+ thisClass.altura + ";padding: 1px;margin:0px;}\n";
	cssClass = cssClass +  ".calendario-fixo .pika-single {font-family: Arial, sans-serif;width:100%;position:relative;padding:10px;z-index: 3;}\n";
	//CSS retirado e colocado no arquivo itau-style.css
	/*
	cssClass = cssClass +  ".calendario-fixo .icone-calendario {background: url('" + path + "/img/icones/icon-calendar.png') no-repeat left center;\n";
	cssClass = cssClass +  "display: inline-block;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-agendamento   ,.calendario-fixo .icone-boleto   ,.calendario-fixo .icone-pago,  \n";
	cssClass = cssClass +  ".calendario-fixo .icone-agendamento-p ,.calendario-fixo .icone-boleto-p ,.calendario-fixo .icone-pago-p,\n";
	cssClass = cssClass +  ".calendario-fixo .icone-agendamento-pp,.calendario-fixo .icone-boleto-pp,.calendario-fixo .icone-pago-pp\n";
	cssClass = cssClass +  "{background: url('" + path + "/img/sprite-legenda-data.png') no-repeat;display:block;\n";
	cssClass = cssClass +  " vertical-align: middle;margin:1px;}\n";*/
	cssClass = cssClass +  ".calendario-fixo .icone-agendamento,.calendario-fixo .icone-boleto, .calendario-fixo .icone-pago\n";
	cssClass = cssClass +  " {height: 16px;width: 16px}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-pago        {background-position:   0px 0px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-agendamento {background-position: -16px 0px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-boleto      {background-position: -32px 0px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-agendamento-p,.calendario-fixo .icone-boleto-p,.calendario-fixo .icone-pago-p\n";
	cssClass = cssClass +  " {height: 12px;width: 14px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-pago-p        {background-position:  -0px -16px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-agendamento-p {background-position: -14px -16px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-boleto-p      {background-position: -28px -16px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-agendamento-pp,.calendario-fixo .icone-boleto-pp,.calendario-fixo .icone-pago-pp\n";
	cssClass = cssClass +  " {height: 8px;width: 10px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-pago-pp        {background-position:   1px -28px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-agendamento-pp {background-position: -9px -28px;}\n";
	cssClass = cssClass +  ".calendario-fixo .icone-boleto-pp      {background-position: -19px -28px;}\n";
	//cssClass = cssClass +  ".calendario-fixo .is-selected .pika-button {color: #fff; font-weight: bold; background: #c8c8c8; box-shadow: inset 0 1px 3px #c9c9c9; border-radius: 3px;}\n";
	cssClass = cssClass +  ".calendario-fixo .is-selected .pika-button {color: #fff; font-weight: bold; background: #c8c8c8; border-radius: 3px;}\n";
	
	//cssClass = cssClass +  ".calendario-fixo .is-today .pika-button {color: #ec7404;}\n";
	cssClass = cssClass +  ".calendario-fixo .pika-button:hover, .calendario-fixo .is-selected .pika-button:hover{color: #106eb0!important;border-color: #106eb0!important;font-weight: bold;background: #FFF!important;}\n";
	//cssClass = cssClass +  ".calendario-fixo .pika-button {height:"+ linhasCalendario + "px" + ";font-size: 10px;padding: 0px;margin:0px}\n";
	cssClass = cssClass +  ".calendario-fixo .pika-button {width: 40px;height: 35px;border-radius: 4px;font-size: 1rem;font-family: Arial,Helvetica,sans-serif;color: #464646;padding: 0;margin: 0 0 6px 0;border: 1px solid transparent;background: 0;cursor: pointer;}\n";

	cssClass = cssClass +  ".calendario-fixo .no-icon {height:16px;}\n";
	cssClass = cssClass +  ".calendario-fixo .pika-table {right:0px;left:0px;bottom:0px;margin: 0px;position:relative}\n";
	cssClass = cssClass +  ".calendario-fixo .pika-table th {line-height:"+ (linhasCalendario) + "px" + ";height:"+ linhasCalendario + ";}\n";
	cssClass = cssClass +  ".calendario-fixo .pika-table .is-empty {line-height:"+ (linhasCalendario) + "px" + ";height:"+ linhasCalendario + ";}\n";
	cssClass = cssClass +  ".calendario-fixo .pika-table {right:0px;left:0px;bottom:0px;margin: 0px;position:relative}\n";
	cssClass = cssClass +  ".calendario-fixo .pika-table th,.calendario-fixo  .pika-table td {border: 1px solid #FFF;}\n";
	cssClass = cssClass +  ".calendario-fixo abbr{padding: 0;text-align: center;padding-bottom: .9375rem;padding-top: 15px;font-family: Arial,Helvetica,sans-serif;font-size: 14px;font-weight: bold;color: #464646;}\n";

	cssClass = cssClass +  "</style>\n";
	
	return cssClass;
},
show : function () {
	var thisClass = this;
	thisClass._init();
},
_retornaOpcoes : function (value) {
	var thisClass = this;
	var result = CalendarioFixoHelper.parseJSON(thisClass.lista);
	if(result.status){
		listaAux = result.data;
		for (var iLoop=0;iLoop < listaAux.length;++iLoop) {
			valor = listaAux[iLoop];
			if (valor.dia == value) {
				return valor.acoes;
			}
		};
	}
	return "";
},
_retornaPath : function () {
	var thisClass = this;
	var strAuxPk="";
	listaScripts = $('script');
	for (var iLoop = 0;iLoop < listaScripts.length; ++iLoop) {
		strAuxPk = $(listaScripts[iLoop]).attr('src');
		if (strAuxPk != null) {
			if (strAuxPk.indexOf('summer-cdn') >=0) {
				if (strAuxPk.indexOf ('http\:\/\/') >=0 || strAuxPk.indexOf ('https\:\/\/') >=0) {
					strAuxPk = strAuxPk.substring (0,strAuxPk.indexOf('summer-cdn')+'summer-cdn'.length);
				}
				else {
					strAuxPk = strAuxPk.substring (0,strAuxPk.indexOf('summer-cdn')+'summer-cdn'.length)+'\/WebContent\/';
				}
				return strAuxPk;
			}
		}
	};

},
refresh : function() {
	var thisClass = this;
	var result = CalendarioFixoHelper.parseJSON(thisClass.lista);
	if(result.status){
		thisClass._pikadayDraw(result.data);
	}
}
}
/* ==============================================================================================
* vitrineCliqueBox: Executa a troca de estado de um elemento dentro de box de vitrine no clique
* 
* Descrição: Executa a troca de estado um elemento 
*
* Autor: Francisco C.Sandro C.Silva/ Osvaldo Monteiro
*
* Data: 10 Abr 2015
*
* Exemplo de uso: Basta colocar as classes no HTML
*
* Dependencia js: jQuery 1.7 ou maior, 
*
* Dependencia CSS: 
* 
* Versao 1.0.0
*
* =============================================================================================== */
var VitrineCliqueBox = {
	init : function () {
		var dvBoxesAlto = $(".box-login-ele-content:not(.box-login-ele-content--last)");
		dvBoxesAlto.on('click', onCliqueVitrine);
	}
}

function onCliqueVitrine () {
	var thisClass = this;
	var dvBoxesAlto = $(".box-login-ele-content:not(.box-login-ele-content--last)");
	var dvRow =  $(thisClass).closest ("[class*='grid-row']");
	var dvBoxAlto = $(dvRow).find(".box-login-ele-content:not(.box-login-ele-content--last)");
	var dvBoxBaixo = $(dvRow).find(".box-login-ele-content.box-login-ele-content--last");
	dvBoxesAlto.off();
	dvBoxAlto.show();
	$(thisClass).hide(500, function () {
		dvBoxesAlto.on('click', onCliqueVitrine);
	});
}

/* ==============================================================================================
* ShowMultiple: Mostra elementos na tela
* 
* Descrição: Mostra elementos na tela a partir de outro elementp
*
* Autor: Francisco C.Sandro C.Silva
*
* Data: 22 Abr 2015
*
* Exemplo de uso: var showDados = new ShowMultiple();
	              showDados.setOrigin ($("#idElementoOrigem"));
	              showDados.addTarget ($("#idElementoTarget1"));
	              showDados.addTarget ($("#idElementoTarget1"));
	              showDados.execute();

*
* Dependencia js: jQuery 1.7 ou maior
*
* Versao 1.0
*
* =============================================================================================== */
function ShowMultiple () {
	var _targets = new Array();
	var _origin  = null;
	this.execute = function () {
		$(_origin).on ('click',function () {
			for (var iLoop=0;iLoop < _targets.length;++iLoop) {
				$(_targets[iLoop]).show();
			}
		});
	};
	this.addTarget = function (target) {
		_targets[_targets.length] = target;
	};
	this.clearTargets = function () {
		_targets.length = 0;
	};
	this.setOrigin = function (origin) {
		_origin = origin;
	};
}
/* ==============================================================================================
* loadingAjax: Substitui o alert do javascript
* 
* Descrição: Tela de espera personalizado
*
* Autor: Itau-Unibanco
*
* Data: 29 Dez 2014
*
* Exemplo de uso: loadingAjax.tempo  = 10000;
		          loadingAjax.funcao = function () {minhaFuncao()};
		          loadingAjax.executar();
*
* Dependencia js: jQuery 1.7 ou maior, 
*
* Dependencia CSS: itau-style.css ( usado na borda da modal  )
* 
* Versao 1.0
*
* =============================================================================================== */
var loadingAjax = {
	tipo      : null,
	url       : null,
	async     : false,
	data      : null,
	tempo     : 2000,
	funcao    : null,
	executar : function () {
		thisClass = this;
		if (thisClass.url == null) {
			thisClass._show('Aguarde...');
			setTimeout(function () {thisClass.onComplete(data)},thisClass.tempo);
		}
		else {
			$.ajax({
				dataType: thisClass.tipo,
				url:      thisClass.url,
				data:     thisClass.data,
				async:    thisClass.async,
		        beforeSend: function(){
		        	thisClass._show('Aguarde...');
			    },
			    complete: function(data) {
			    	setTimeout(function () {thisClass.onComplete(data)},thisClass.tempo);
			    }
			});
		}		
	},
	onComplete : function (data){
		if ((thisClass.funcao) && typeof(thisClass.funcao) == "function") {
			thisClass.funcao(data);
		}
		//Esconde gif de execução
		thisClass._hide();
	},
	// Rotina que injeta a div de mensagem no html
	// O exemplo abaixo está usando o lightbox para mostrar o gif
	_init : function () {
		var sConteudo = "";
		sConteudo = '<div id="divGif" class="modulo modulo-lightbox center">\n';
		sConteudo = sConteudo + '<section id="sectionGif">\n';
		sConteudo = sConteudo + "<div id='divimg'><img id='img1' src='http://jarvisfabrica.itau/summer-cdn/commons/img/loading-big.gif' /></div>";
		sConteudo = sConteudo + '<h3 id="h3MsgGif">\n';
		sConteudo = sConteudo + '<span class="destaque"> <p> </p></span>';
		sConteudo = sConteudo + '</h3>';
		sConteudo = sConteudo + '</section>\n';
		sConteudo = sConteudo + '</div>\n';
		$('body').append (sConteudo);
		$("#divGif" ).hide();
		$("#divGif" ).height("140px");
		$("#divGif" ).width("180px");
		$("#divGif" ).show();
	},
    _show : function (mensagem) {
    	thisClass._init();
    	$("#divGif p" ).html(mensagem)
		$("#divGif" ).show();
	},
	_hide : function () {
		$(".mfp-close").click();
		$("#divGif" ).hide();
		$("#divGif" ).remove();
	}
}
var adobeDataLayer = {

    init: function() {
        window.analyticsData = {};
    },

    pushSite: function(nome, ambiente, negocio, tipoDeCanal) {
        analyticsData.site = {};
        if(nome != "" ){analyticsData.site.nome = nome;}
        if(ambiente != "" ){analyticsData.site.ambiente = ambiente;}
        if(negocio != "" ){analyticsData.site.negocio = negocio;}
        if(tipoDeCanal != "" ){analyticsData.site.tipoDeCanal = tipoDeCanal;}
    },

    pushPage: function(secao, url, subSecao1, subSecao2, subSecao3,idTecnico, ambiente, partnerForm, nome, warnings, mantemDados) {
        if(mantemDados != "true"){
            analyticsData.page = {};
        }

        if(typeof nome != "undefined" && nome != "" && nome != " "){
            if(nome !== "warnings-view"){
                analyticsData.page.nome = nome; 
            }
        }else if(typeof pageNameAnalytics != "undefined" && pageNameAnalytics !== "" && pageNameAnalytics !== " " ){
            analyticsData.page.nome = pageNameAnalytics; 
        }
        if(secao != ""){analyticsData.page.secao = secao;}
        if(url != ""){analyticsData.page.url = url;}
        if(subSecao1 != ""){analyticsData.page.subSecao1 = subSecao1;}
        if(subSecao2 != ""){analyticsData.page.subSecao2 = subSecao2;}
        if(subSecao3 != ""){analyticsData.page.subSecao3 = subSecao3;}
        if(idTecnico != ""){analyticsData.page.idTecnico = idTecnico;}
        if(ambiente != ""){analyticsData.page.ambiente = ambiente;}
        if(partnerForm != ""){analyticsData.page.partnerForm = partnerForm;}
        if(warnings != "" && warnings != null) {
            if($.isArray(warnings)){
                analyticsData.page.warnings = warnings;
            }else{
                analyticsData.page.warnings = [warnings];
            }
        }        
        
        /*Observação​: ​APENAS PARA BANKLINE O nome da página será disponibilizado nas páginas em uma variável JavaScript definida pelo Core. Para páginas da ​Nova Internet​, essa variável irá receber o ​Nome Analytics​ das páginas. Para páginas da ​Universal​, essa variável irá receber o​ ID da Página​. O nome da variável será​ analyticsName
        */
    },


    pushVisitor: function(tipoCliente, segmento, iDPF, iDPJ, iDOperador, tipoOperador, iToken) {
        analyticsData.visitor = {};
        if(tipoCliente != ""){analyticsData.visitor.tipoCliente = tipoCliente;}
        if(segmento != ""){analyticsData.visitor.segmento = segmento;}
        if(iDPF != ""){analyticsData.visitor.iDPF = iDPF;}
        if(iDPJ != ""){analyticsData.visitor.iDPJ = iDPJ;}
        if(iDOperador != ""){analyticsData.visitor.iDOperador = iDOperador;}
        if(tipoOperador != undefined && tipoOperador != ""){analyticsData.visitor.tipoOperador = tipoOperador;}
    	if(iToken != undefined && iToken != ""){analyticsData.visitor.iToken = iToken ? "Habilitado" : "Desabilitado";}
    },

    /**
     * Responsavel por criar o produto no objeto analyticsData
     * 
     * @param sku Identificador do produto
     * @param merchandising
     * @param incrementor
     * @param nome Nome do produto
     */
    pushProduct: function(sku, merchandising, incrementor, nome) {
        analyticsData.product = {
                "items": [], 
                "confirmacao": {
                    "id":"", 
                    "tarifacao": { 

                    }
                }
            }

        var qtd = analyticsData.product.items.length //verifico o len do arry items

    	analyticsData.product.items = [{}];
    	
    	if(sku != undefined && sku != "") {
			analyticsData.product.items[qtd].sku = sku;
		}
		
		if(nome != undefined && nome != "") {
			analyticsData.product.items[qtd].nome = nome;
		}

		if(merchandising != undefined && merchandising != ""){
			analyticsData.product.items[qtd].merchandising = merchandising;
		}  
    	
    	if(incrementor != undefined && incrementor != ""){
			if($.isArray(incrementor)){
				analyticsData.product.items[qtd].incrementor = incrementor;
			}else{
				analyticsData.product.items[qtd].incrementor = [incrementor];
			}
		}

    },

    pushProductDetalhes: function(id, tarifa, adesao, event) {
        if(id != ""){analyticsData.product.confirmacao.id = id;}
        if(tarifa != ""){analyticsData.product.confirmacao.tarifacao.tarifa = tarifa;}
        if(adesao != ""){analyticsData.product.confirmacao.tarifacao.adesao = adesao;}
        if(event != ""){analyticsData.product.event = event;}
    },

    pushCustom: function(chave, valor) {
        if(!analyticsData.custom){
            analyticsData.custom = {};
        }

        if(chave == "events"){
            if($.isArray(valor)){
                analyticsData.custom[chave] = valor;
            }else{
                analyticsData.custom[chave] = [valor];
            }
        }else{
            if(valor != ""){analyticsData.custom[chave] = valor;}
            
        }
    },

    /**
     * Responsavel por limpar o custom no objeto analyticsData
     */
    clearCustom: function() {
        analyticsData.custom = {};
    },

    pushRule: function(rule) {
        analyticsData.rule = {};
        if(rule != ""){analyticsData.rule = rule;}
    },

    sendDataLayer: function() {
    	try{
            if(window.console){
                console.log("JSON dataLayer: "+JSON.stringify(analyticsData));
            }
            _satellite.track('async_content_load');
    	}catch(err){
    		if(window.console){
    			//console.log("Erro na chamada sendDataLayer");
    		}
    	}
    },
    
    pushProductTransferencia: function(merchandising, produto, item, idConfirmacaoProduto) {
    	analyticsData.product = new Object();

        if(produto != null && produto != undefined){
    	    if(produto.categoria != null && produto.categoria != undefined){
				analyticsData.product.categoria = produto.categoria;
    		}
    		if(produto.nome != null && produto.nome != undefined){
				analyticsData.product.nome = produto.nome; 	
    		}
    		if(produto.event != null && produto.event != undefined){
    			analyticsData.product.event = produto.event;
    		}
    	} 

	    if(item != null && item != [] && item != undefined){
	    	analyticsData.product.items = new Object();
	    	analyticsData.product.items.categoria = item.categoria;
	    	analyticsData.product.items.nome      = item.nome;
	    	merchandising != null && merchandising != "" && merchandising != undefined ? analyticsData.product.items.merchandising = merchandising : "";
		}

	    if(idConfirmacaoProduto != null && idConfirmacaoProduto != undefined && idConfirmacaoProduto != ""){
	    	analyticsData.product.confirmacao = new Object();
	    	analyticsData.product.confirmacao.id = idConfirmacaoProduto;
	    }
		
	}

};
var GA = {

    init: function(portalGA) {
        window.portalAnalytics = portalGA;
        window.dataLayer = window.dataLayer || [];
        
        this._initFunctionGA(window,document,'script','dataLayer','GTM-N25XM3');
    },

    _initFunctionGA: function(w,d,s,l,i){

    },

    //Definição das funções GA:
    //BUSCA
    pushBusca: function(palavraBuscada) {
        dataLayer.push({
            'event' : "busca",
            'portal' : window.portalAnalytics,
            'palavraBuscada' : palavraBuscada,
        });
    },

    //CARTAO_FATURA
    //FOOTER
    //HEADER
    //LOGIN
    //MAPA_SITE
    //MEGA_MENU
    pushCartaoFatura: function(nivel1, nivel2) {
        dataLayer.push({
            'event' : "cartaoFatura",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'nivel1' : nivel1,
            'nivel2' : typeof nivel2 != 'undefined' ? nivel2 : "homeCategoria",
        });
    },

    pushFooter: function(nivel1, nivel2) {
        dataLayer.push({
            'event' : "footer",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'nivel1' : nivel1,
            'nivel2' : typeof nivel2 != 'undefined' ? nivel2 : "homeCategoria",
        });
    },

    pushHeader: function(nivel1, nivel2) {
        dataLayer.push({
            'event' : "header",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'nivel1' : nivel1,
            'nivel2' : typeof nivel2 != 'undefined' ? nivel2 : "homeCategoria",
        });
    },

    pushLogin: function(nivel1, nivel2) {
        dataLayer.push({
            'event' : "login",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'nivel1' : nivel1,
            'nivel2' : typeof nivel2 != 'undefined' ? nivel2 : "homeCategoria",
        });
    },

    pushMapaSite: function(nivel1, nivel2) {
        dataLayer.push({
            'event' : "mapaSite",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'nivel1' : nivel1,
            'nivel2' : typeof nivel2 != 'undefined' ? nivel2 : "homeCategoria",
        });
    },

    pushMegaMenu: function(nivel1, nivel2) {
        dataLayer.push({
            'event' : "megaMenu",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'nivel1' : nivel1,
            'nivel2' : typeof nivel2 != 'undefined' ? nivel2 : "homeCategoria",
        });
    },

    //MENU_CATEGORIA
    //MODULO_CATEGORIA
    pushMenuCategoria: function(categoriaProduto, nivel1, nivel2) {
        dataLayer.push({
            'event' : "menuCategoria",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'categoriaProduto' : categoriaProduto,
            'nivel1' : nivel1,
            'nivel2' : typeof nivel2 != 'undefined' ? nivel2 : "homeCategoria",
        });
    },

    pushModuloCategoria: function(categoriaProduto, nivel1, nivel2) {
        dataLayer.push({
            'event' : "moduloCategoria",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'categoriaProduto' : categoriaProduto,
            'nivel1' : nivel1,
            'nivel2' : typeof nivel2 != 'undefined' ? nivel2 : "homeCategoria",
        });
    },

    //PAGE_VIEW
    pushPageView: function(nomePagina) {
        window.paginaAnalytics = nomePagina;
        dataLayer.push({
            'event' : "pageView",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
        });
    },

    //Chamado de Page View Virtual (Evento tageado como página)
    //OFERTA
    //OFERTA_CRM
    //USO
    pushOferta: function(campanhaProdutoServico, local, formato) {
        dataLayer.push({
            'event' : "oferta",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'campanhaProdutoServico' : campanhaProdutoServico,
            'localExibido' : local,
            'formatoExibido' : formato,
        });
    },

    pushOfertaCrm: function(campanhaProdutoServico, local, formato) {
        dataLayer.push({
            'event' : "ofertaCrm",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'campanhaProdutoServico' : campanhaProdutoServico,
            'localExibido' : local,
            'formatoExibido' : formato
        });
    },

    pushUso: function(campanhaProdutoServico, local, formato) {
        dataLayer.push({
            'event' : "uso",
            'portal' : window.portalAnalytics,
            'nomePagina' : window.paginaAnalytics,
            'campanhaProdutoServico' : campanhaProdutoServico,
            'localExibido' : local,
            'formatoExibido' : formato,
        });
    },
        
    pushSeguranca: function(campanhaProdutoServico, local, formato){
    	dataLayer.push({
    		'event' : "seguranca",
    		'portal' : window.portalAnalytics,
    		'nomePagina' : window.paginaAnalytics,
    		'campanhaProdutoServico' : campanhaProdutoServico,
    		'localExibido' : local,
    		'formatoExibido' : formato
    	});
    }
};

﻿
(function($public, $private) {
	
	$private.getOptionsDefault = function() {
		return {
		    urlBox : "",
		    seletorContainer : "",
		    timeout: 30000,
			tratarError : true,
		    data : {},
			msgError : "Desculpe-nos, sistema indisponível no momento. Tente novamente em alguns instantes.",
			isAberto : false,
			onSuccess : function(data){},
			onComplete : function(data){},
			onError : function(data){}
		};		
	};
	
	
	$private.renderBox = function(options) {
		if(options.showLoader===true){
			setTimeout($(options.seletorContainer).html($private.getHtmlLoader()), 2000);
		}
		$private.ajaxBox(options, true, function(data){
			options.onComplete(data);
			options.onSuccess(data);
		}, function(data){
			options.onComplete(data);
			options.onError(data);
		}); 
	};
	
	$private.renderBoxHome = function(options) {
		$private.ajaxBox(options, false, function(data){
			options.onComplete(data);
			options.onSuccess(data);
		}, function(data){
			options.onComplete(data);
			options.onError(data);
		}); 
	};
	
	$private.getHtmlLoader = function() {
		var rootSrc = $("img").eq(0).attr("src").split("/commons/");
		var loader = ['<div class="row center clearfix">',
							"<div id='divGif' class='row center clearfix '>",
								"<img src='" + rootSrc[0] + "/commons/img/loading-mini.gif' class='center' alt='Carregando' />",
								'<br/><h3 class="txt-destaque">Carregando...<h3>',
							'</div>',
						'</div> '];
		return loader.join("");
	};

	$private.ajaxBox = function(options, showLoading, fnSuccess, fnError) {
		options.data = typeof options.data == 'undefined' ? {} : options.data;
		options.data.isAberto = options.isAberto ? true : false;
		if(window.pilhaRequest == undefined){
			window.pilhaRequest = new Array();
		}		
		pilhaRequest.push($.Ajax({
			type : 'POST',
			timeout: options.timeout,
			showLoading : showLoading,
			headers: {
				"op" : options.urlBox,
				"ajaxRequest": true,
				scrollToTop : false
			},
			data : options.data,
			success: function(data) {
				$(options.seletorContainer).html(data);
				fnSuccess(data);
			},
			error: function(error){
				if(options.tratarError == true){
					$(options.seletorContainer).html($private.createBoxAviso(options.msgError));
				}				
				fnError(error);
			}
		})); 
	};

	$private.createBoxAviso = function(msg){
		var boxAviso = [
		'<div class="box-info box-info-alerta incluir-tabindex" role="alert">',
			'<span class="icone"></span>',
        		'<p>' + msg + '</p>',
		'</div>'];
		return boxAviso.join("");
	};
	
	$private.renderConteudoBox = function(options) {
		$(options.seletorContainer).html($private.getHtmlLoader());
		$private.ajaxBox(options, false, function(data){
			options.onComplete(data);
			options.onSuccess(data);
		}, function(data){
			options.onComplete(data);
			options.onError(data);
		}); 
	};
		
	$public.BoxHelper = {
		renderBox : function(options){
			var optionsBox = $.extend($private.getOptionsDefault(), options);
			$private.renderBox(optionsBox);
		},
		renderBoxHome : function(options){
			var optionsBox = $.extend($private.getOptionsDefault(), options);
			$(".blockUI").remove();
			$private.renderBoxHome(optionsBox);
		},
		renderConteudoBox : function(options){
			var optionsBox = $.extend($private.getOptionsDefault(), options);
			$private.renderConteudoBox(optionsBox);
		}
	};
	
	
	
})(window, {});

﻿//start-ui
/**
 * Classe responsavel pela configuração comum de todos os elementos da tela
 */
(function(window){	
	window.loadHomePage = function(op, fn){		
		$.ajax({
			type : "POST",
			headers : {
				"op": op,
				"ajaxRequest" : true,
				scrollToTop : true
			},
			success : function(data) {				
				window.startApp();
				$("#content").html(data);
				if (typeof fn === "function") {
					fn();
				}
			}
		});	
	}
	
	window.startApp = function(){
		$("html").removeClass("uiConfiguration-runed");
		uiConfiguration.configure();
	};
})(window);

$.fn.addDelegateEvent = function(evento, seletor, fn) {	
	var seletorContainer = "body";
	var log = ("addDelegateEvent["+ evento + "]: (" + seletor + ")");
	$(seletorContainer).on(evento, seletor, fn);	
};



var uiConfiguration = {
	configure : function(executaFns) {
		var thisClass = this;
		var configureTooltip = function() {
		
			if ($('[rel="tooltip-big"]')) {
				$('[rel="tooltip-big"]').popover();
			}
			
			if ($('[rel="tooltip-mini"]')) {
				$('[rel="tooltip-mini"]').tooltip();
			}
			
			$(document).off('click.tooltipBig');
			$(document).on('click.tooltipBig', function (e) {
				$('[rel="tooltip-big"]').each(function(){
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
						$(this).popover('hide');
					}
				});
			});
			
		};

		var configureNoPaste = function() {
			$('.no-paste').bind('paste drop',function(event){
				event.preventDefault();
			});
		};


		var configureAbas = function() {
			$(document).addDelegateEvent('click', '[data-tab]', function(e) {
				$(this).addClass('ativo').siblings('[data-tab]')
						.removeClass('ativo').siblings(
								'[data-content=' + $(this).data('tab')
										+ ']').addClass('ativo')
						.siblings('[data-content]')
						.removeClass('ativo');
				e.preventDefault();
			});

			// comportamento de abas utilizadas no chat box
			$(document).addDelegateEvent('click', '.tab-act-links a', function(){
				var target = $(this).attr('data-target');

				$(this).closest('.tab-act').find('.tab-act-links a').removeClass('active');
				$(this).addClass('active');

				$(this).closest('.tab-act').find('section').removeClass('active');
				$(this).closest('.tab-act').find('section#'+target).addClass('active');
			});
		};
		

		var configureAbasAcessivel = function() {
			$(document).addDelegateEvent('click', '[data-tabs]', function(e) {
				$(this).addClass('tabs-nav--active').siblings('[data-tabs]')
					.removeClass('tabs-nav--active').parent().siblings(
							'[data-content=' + $(this).data('tabs')
									+ ']').addClass('tabs-content--active')
					.siblings('[data-content]')
					.removeClass('tabs-content--active');
				e.preventDefault();


				$(this).children('a').attr('aria-selected','true')
				.parent().siblings('[data-tabs]').children('a').attr('aria-selected','false');
			});
		};

		var formataValorMonetario = function (event, element){

			element.unmask();
			var valor = element.val().replace(/\D/g, "");

			valor = valor.length > 13 ? valor.substring(valor.length - 14, valor.length - 1) : valor;
			valor = parseFloat(valor);
			if(valor == 0){
				element.val("000");
			}else if(valor < 10){
				if(!isNaN(valor)){
					element.val("00" + valor);
				}
			}else if(valor < 100){
				if(!isNaN(valor)){
					element.val("0" + valor);
				}
			}else if(valor >= 100){
				if(!isNaN(valor)){
					element.val(valor);
				}
			}
			element.mask('00.000.000.000,00', {
				reverse : true
			});
		};

		var configureValoresMonetarios = function() {
			$(document).addDelegateEvent("input", ".formatar-valor-monetario", function(event){
				formataValorMonetario(event, $(this));
			});
		};

		var configurePaginacaoAcessivel = function() {
			$('.my-navigation').attr('role','navigation');
			$('.simple-pagination-navigation-page').attr('aria-pressed','false').attr("role","button");
			$('.simple-pagination-page-numbers').find('.simple-pagination-navigation-disabled').attr('aria-pressed','true');
			
			$(document).off('click.dataSimplePaginationPageNumber');
			$(document).on('click.dataSimplePaginationPageNumber', '[data-simple-pagination-page-number]', function(e) {
				$('.simple-pagination-navigation-page').attr('aria-pressed','false');
				$('.simple-pagination-page-numbers').find('.simple-pagination-navigation-disabled').attr('aria-pressed','true');
			});  
  				
  			// adiciona texto com leitura exclusiva para o leitor de tela nos itens anterior e proximo da navegação	
			setTimeout(function(){
				// removo o paragrafo com texto acessivel antes de incluir novamente, para evitar 
				//$('.simple-pagination-navigation-previous p.text-access-hide').remove();
				//$('.simple-pagination-navigation-previous').prepend("<p class='text-access-hide'>anterior</p>");
   				$('.simple-pagination-navigation-previous').text("<");

   				// removo o paragrafo com texto acessivel antes de incluir novamente, para evitar 
				//$('.simple-pagination-navigation-next p.text-access-hide').remove();
				//$('.simple-pagination-navigation-next').prepend("<p class='text-access-hide'>próximo</p>");
				$('.simple-pagination-navigation-next').text(">");
			}, 200);
		};	

		var configureMenu = function() {
			
			var $scopePrivate = {};
			
			$scopePrivate.configuraFundoMenu = function(){
				
				if($('.sub-mnu-pj').length == 0){
					//acerta o fundo do menu PF
					var tamDiv1 = $('.sub-mnu').find('.col').height();
					var tamDiv2 = $('.sub-mnu').find('.col').next().height();
					var tamDiv3 = $('.sub-mnu').find('.col').next().next().height();
					var tamMaxDiv = tamDiv1;
					if (tamDiv3 > tamDiv1 && tamDiv3 > tamDiv2) {
						tamMaxDiv = tamDiv3;
					} else if(tamDiv2 > tamDiv1) {
						tamMaxDiv = tamDiv2;
					}
					$('.sub-mnu').find('.col').height(tamMaxDiv);
				}else{
					var tamDiv1Pj = $('.sub-mnu-pj').find('.col').find("ul").height();
					$('.sub-mnu-pj').find('.col').height(tamDiv1Pj);
				}
			}

			/////////////STATUS INICIAL ACESSIBILIDADE //marca o menu como recolhido
			$('.mnu .btn-nav').attr("aria-expanded","false");
			
			/////////////MOUSE ENTER NO MENU
			$(document).addDelegateEvent("mouseenter", "nav ul li.mnu",function() {
				if (screen.width > 1024) {
					$(this).children('.sub-mnu').removeClass('hide');
					$('.mnu .btn-nav').attr("aria-expanded","true");
					$scopePrivate.configuraFundoMenu();
				}
			});

			/////////////MOUSE LEAVE NO MENU
			$(document).addDelegateEvent("mouseleave", "nav ul li.mnu", function() {
				if (screen.width > 1024) {
					$(this).children('.sub-mnu').addClass('hide');
					$(this).find('.content-sub-mnu-pj').addClass('hide');
					$('.sub-mnu-pj-conteudo').removeClass('sub-mnu-pj-fixo');
					$('.mnu .btn-nav').attr("aria-expanded","false");
				}
				
			});
			
			/////////////CLICK e TECLA APERTADA NO MENU
			$(document).addDelegateEvent("keyup, click", "nav ul li.mnu", function(event) {
				$(this).children('.sub-mnu').toggleClass('hide');
				if(!$(this).children('.sub-mnu').hasClass("hide")){
					$scopePrivate.configuraFundoMenu();
				}

				if($('.mnu .sub-mnu').is(":visible")){
					$('.mnu .btn-nav').attr("aria-expanded","true")
				}else{
					$('.mnu .btn-nav').attr("aria-expanded","false")
				}
			});

			/// click avatar de configurações
			$(document).addDelegateEvent("click", ".ico-configuracoes",function() {
				$('.content-config').toggleClass('hide');
			});
			
			$(document).off("click.fechaConfiguracoes").on("click.fechaConfiguracoes", "body", function(e) {
				if(!$(e.target).closest($("#divConfiguracoes")).length){
					$('.content-config').addClass('hide');	
					$('#iconeMeusDados').attr('aria-expanded', 'false');
				}
			});
			
		};
	   
		var configureSubMenuPJ = function() {
			  
			var $menu = $('.sub-mnu ul');
			
			$menu.menuAim({
			  activate: activateSubmenu,
			  deactivate: deactivateSubmenu
			});

			function activateSubmenu(row) {
				  $(row).children('.content-sub-mnu-pj').removeClass('hide');
			}

			function deactivateSubmenu(row) {
				  $(row).children('.content-sub-mnu-pj').addClass('hide');
				  $(row).removeClass('sub-mnu-pj-fixo');
			}

			$(document).addDelegateEvent("mouseenter", '.sub-mnu-pj-conteudo', function() {
				$(this).addClass('sub-mnu-pj-fixo');
			});

			$(document).on("mouseenter", '.sub-mnu-pj-conteudo', function() {
				$(this).children('.content-sub-mnu-pj').removeClass('hide');
			});

			$(document).addDelegateEvent("mouseleave", '.sub-mnu-pj-conteudo', function() {
				$(this).children('.content-sub-mnu-pj').addClass('hide');
				$(this).removeClass('sub-mnu-pj-fixo');
			});
		   
			 //eventos para acesisbilidade - tabindex
			var targetX;
			$(document).addDelegateEvent("keydown", '.sub-mnu-pj-conteudo', function(e) {
			   targetX = $(e.target);
			});
			$(document).addDelegateEvent("keyup", '.sub-mnu-pj-conteudo', function(e) {
				if ($(e.target).hasClass("sub-mnu-pj-conteudo") && $(targetX).hasClass("sub-mnu-pj-conteudo")){
					$(targetX).children('.content-sub-mnu-pj').addClass('hide');
					$(targetX).removeClass('sub-mnu-pj-fixo');
				}
			});
		   
			$(document).addDelegateEvent("focus", '.sub-mnu-pj-conteudo', function() {
				$(this).children('.content-sub-mnu-pj').removeClass('hide');
			});
   
			$(document).addDelegateEvent("focus", '.sub-mnu-pj-conteudo', function() {
				$(this).addClass('sub-mnu-pj-fixo');
			});
			
			$(document).addDelegateEvent("focusout", '.content-sub-mnu-pj', function(event) {
				var targetAtual = $(event.target).get(0);
				var ultimoTarget = $(retornaUltimoElementoFilho($(event.currentTarget), "")).get(0);
				if ($(targetAtual.children).is(ultimoTarget) == true) {
				   $(event.currentTarget).addClass('hide');
				   $(event.currentTarget).parent().removeClass('sub-mnu-pj-fixo');
				};
			});
			
			$(document).addDelegateEvent("keydown", '.sub-mnu li:last a', function(e) {
				var tecla=(window.event)?event.keyCode:event.which;
				if(tecla == 9 && e.shiftKey!=1){
					$('.sub-mnu').addClass('hide');
				}
			});
			
			
			//fuction para auxiliar pegar ultimo item do megaMenu PJ
			function retornaUltimoElementoFilho(elemento){
				var x = elemento.children().last();
				if (x != "" && typeof x.get(0) != typeof undefined) {
					elemento = x;
					elemento = retornaUltimoElementoFilho(elemento);
				};
				return elemento;
			};
		   
	   };
	   	   
        var extractOrganization = function(title) {
            return (title || '').replace(/^[^|]*/, "").trim()
        }

        var prepareDynamicTitle = function(title) {
            var sulffix = extractOrganization(document.title) || "| Banco Itaú";
            var contentTitle = (title || '').trim() || "Inicial";
            return contentTitle + " " + sulffix;
        }

        //Verifica se pagina carregada contem H1 e injeta no titulo da pagina, caso contrario injeta titulo padrao
        var configureTituloPaginaDinamico = function(){
            // preenche title
            var valTitle = prepareDynamicTitle($("#content h1").text());
            $("head title").text(valTitle);
        }

	   
	   var configureAreaClienteAcessibilidade = function(){
		   
			$(document).addDelegateEvent("click", '#iconeMeusDados', function() {
				var expandido = $(this).attr('aria-expanded');

				if(expandido == 'true'){
					$(this).attr('aria-expanded', 'false');
				} else {
					$(this).attr('aria-expanded', 'true');
				}
				
			});
			
	   };
	   
	   var configureIrParaConteudoAcessivel = function(){

			var elementoHrefAcessivelConteudo = $("#irParaConteudo");
			///se o link já existir não inclui novamente
			if (elementoHrefAcessivelConteudo.length  < 1) {
				$("header").prepend("<div id='feedbackAcessibilidadeGlobal' class='text-access-hide' role='status'></div><div class='text-access-hide conteudo-carregado'></div><a id='irParaConteudo' href='#' class='text-access-hide skip-to' tabindex='0'>Ir para conteúdo principal</a>" );
			};

			var elementoExisteMenu = $("nav.menu ul li.mnu");
			///verifica se existe o menu antes de incluir o link de acessibilidade
			if (elementoExisteMenu.length  >= 1) {
				
				var elementoHrefAcessivelMenu = $("#irParaMenu");
				///se o link já existir não inclui novamente
				if (elementoHrefAcessivelMenu.length  < 1) {
					$("<a id='irParaMenu' href='#' class='text-access-hide skip-to' tabindex='0'>Ir para o menu</a>").insertAfter("#irParaConteudo");
				};

				
			}

			if($("#input-busca").length){
				var elementoExisteBusca = $("#input-busca");
			}else{
				var elementoExisteBusca = $("#queryPesquisa"); // input busca do mono
			}
			
			///verifica se existe a busca antes de incluir o link de acessibilidade
			if (elementoExisteBusca.length  >= 1) {
				var elementoHrefAcessivelBusca = $("#irParaBusca");
				///se o link já existir não inclui novamente
				if (elementoHrefAcessivelBusca.length  < 1) {
					$("<a id='irParaBusca' href='#' class='text-access-hide skip-to' tabindex='0'>Ir para a Busca</a>").insertAfter("#irParaMenu");
				};
			}
			
			/*	
			// CODIGO COMENTADO PARA CORRIGIR NAVEGAÇÃO POR TECLAS (shift + tab no ultimo link do footer)

			// Após o último item do footer, ir para conteúdo - PF
			$(document).addDelegateEvent("blur", '.ul-block li:last', function() {
			   $("#irParaConteudo").focus();
			});
			// Após o último item do footer, ir para conteúdo - PJ
			$(document).addDelegateEvent("blur", '.grid-col2 li:last', function() {
			   $("#irParaConteudo").focus();
			});*/
			

// colocado fora do ui-configuration

			/*$(document).addDelegateEvent("click", '#irParaConteudo', function(event) {
				event.preventDefault();
				// pega o valor do tabindex do botão sair
				var tabSair  = parseInt($(".btn-sair a").attr("tabindex"));
				// soma 2 ao valor do sair (2 pq existe um elemento entre o sair e o conteudo)
				var tabConteudo = tabSair+2;
				// coloco o foco no conteudo inicial que seja referente a 2 tabindex após o bt sair.
				$("[tabindex="+tabConteudo+"]").focus();
				//$("#content").focus();
			});

			$(document).addDelegateEvent("click", '#irParaMenu', function(event) {
				event.preventDefault();
				$("nav ul li.mnu a:first").focus();
			});

			$(document).addDelegateEvent("click", '#irParaBusca', function(event) {
				event.preventDefault();
				$("#input-busca").focus();
				console.log("irParaBusca");
			});*/
			
	   }

		function configurePlaceHolder(){
				$('[placeholder]').not(".placeholder-executed").placeholder().addClass("placeholder-executed");
		}

		var configureMasks = function() {
			/* Datas */
			$('.mask-data').mask('00/00/0000');
			$('.mask-dia').mask('00');
			$('.mask-mes').mask('00');
			$('.mask-ano').mask('0000');
			$('.mask-tempo').mask('00:00:00');
			$('.mask-data_tempo').mask('00/00/0000 00:00:00');

			/* Telefones */
			var maskComDDD = function (val) {
				  return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
				},
				options = {onkeyup: function(val, e, field, options) {
						field.mask(maskComDDD.apply({}, arguments), options);
					}
				};
				
			var maskSemDDD = function (val) {		
				  return val.replace(/\D/g, '').length === 9 ? '00000-0000' : '0000-00009';
				},
				options = {onkeyup: function(val, e, field, options) {
						field.mask(maskSemDDD.apply({}, arguments), options);
					}
				};
				
			$('.mask-fone').mask(maskSemDDD, options);
			$('.mask-fone-res').mask('0000-0000');
			$('.mask-ddd').mask('(00)');
			$('.mask-fone_ddd').mask(maskComDDD, options);

			/* Endereços */
			$('.mask-cep').mask('00000-000');

			/* Documentos */
			$('.mask-cpf').mask('000.000.000-00');
			$('.mask-cnpj').mask('000.000.000/0000-00');
			$('.mask-rg').mask('00.000.000-A');

			/* Valores */

			// nova mask-valor utilizando o plugin jquery-mask-Money
			$(".mask-valor").maskMoney({allowNegative: false, thousands:'.', decimal:',', affixesStay: false});

			/// antiga mask-valor usando o plugin jquery-mask - codigo mantido aqui caso precise voltar a versão - 24/06/2016
			/*function formtZeroEsquerda(valor,tecla){
				if(tecla >= 48 && tecla <= 57 || tecla >= 96 && tecla <= 105 ){
					if(valor[0] == 0){
						valor = valor.slice(1);
						this.document.activeElement.value = valor;
					}
				}
				if(this.document.activeElement.value.length <= 3){
					this.document.activeElement.value = '0,'+valor;
				} 
			}
			var options =  { 
			  onKeyPress: function(valor, event, currentField, options){
				var tecla=(window.event)?event.keyCode:event.which;
				formtZeroEsquerda(valor,tecla);
			  },
				reverse : true,
				maxlength : false				
			};
			
			$('.mask-valor').mask('#.##0,00', options);
			$('.mask-valor').focus(function(){
				if($(this).val() == ''){
					this.value = '0,00';
				}
			});
			$('.mask-valor').keypress(function(){
				if($(this).val() == '' || $(this).val() == '0'|| $(this).val() == '0,' || $(this).val() == '0,0'){
					this.value = '0,00';
				}
			});*/
			////////////////////////////
						
			/* Valores */
			$('.mask-porcentagem').mask('##0,00%', {
				reverse : true
			});
			/* Diversos */
			$('.mask-ip').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
				translation : {
					'Z' : {
						pattern : /[0-9]/,
						optional : true
					}
				}
			});

			/* Conta Dac*/
			var options =  {
				reverse : true
			};
			$('.mask-conta-dac').mask('00000-0', options);
		};

		var configureDropDown = function() {
			$(document).addDelegateEvent("click", '.dropdown' , function() {				
				var height = $(this).parent().outerHeight(true,true);
				var top = $(this).parent().offset().top;

				if (!$(this).children('.dropdown_menu').is(":visible")) {
					$('.dropdown_menu').stop(true, true).fadeOut(200);
					$(this).children('.dropdown_menu').stop(true, true).fadeIn(200);
					$(this).children('.dropdown_menu.adjustHeight').css({
						"height" : height,
						"padding-right" : "20px",
						"overflow-y" : "auto",
						"overflow-x" : "hidden"
					});
				} else {
					$('.dropdown_menu').stop(true, true).fadeOut(200);
				}
			});

			$(document).addDelegateEvent("click",'.dropdown .dropdown_menu .opcao', function() {
				var selectedValue = $(this).text();
				var url = $(this).data('url');
				$(this).parent('.dropdown_menu').siblings('span').text(selectedValue);
				if (url) {
					window.location.href = url;
				}
			});

		};

		var configureCommons = function() {
			$(document).addDelegateEvent("click",".seleciona-conteudo", function(e) {
				e.preventDefault();
				var contSub = $(this).attr("data-aba");
				$(this).parents('.formulario').find('.drop-conteudo').addClass('hide');
				$(this).parents('.formulario').find('.drop-conteudo#' + contSub + '').removeClass('hide');
			});

			$(document).addDelegateEvent("change", '#seleciona-autenticacao', function() {
				$('#content-chaveiro, #content-sms, #content-app').addClass('hide');
				$('#content-' + $(this).find('option:selected').attr('id')).removeClass('hide');
			});

			$(document).addDelegateEvent("change",'#seleciona-periodo', function() {
				if ($('#seleciona-periodo').val() == 'Especifico') {
					$('#fatura-periodo-especifico').removeClass('hide');
				} else {
					$('#fatura-periodo-especifico').addClass('hide');
				}

			});

			$(document).addDelegateEvent('click', '.fechar', function() {
				$(this).parents('.box-info-alerta').fadeOut(300);
			}); // end Fechar Alerta
			
			$(document).addDelegateEvent('click', '.fechar', function() {
				$(this).parents('.box-info-comprovante').fadeOut(300);
			}); // end Fechar Alerta
		};


		var configureForms = function() {			
			
			$(document).addDelegateEvent("focusin", '.invalido' , function() {
				$('.mensagem-erro').hide();
				$("." + $(this).attr('validacao')).show();
			});
			
			$(document).addDelegateEvent("focusout", '.invalido' , function() {
				$('.mensagem-erro').hide();
			});

			$( document ).ajaxComplete(function( event, xhr, settings ) {
				$('.invalido').each(function(index, element) {
					var newIndex = index + 1;
					$(this).attr('validacao', 'campo' + newIndex);
				});
	
				$('.mensagem-erro').each(function(index, element) {
					var newIndex = index + 1;
					$(this).addClass('campo' + newIndex);
				});
				
				$('.mensagem-erro').hide();
			});
			
			$('.invalido').each(function(index, element) {
				var newIndex = index + 1;
				$(this).attr('validacao', 'campo' + newIndex);
			});

			$('.mensagem-erro').each(function(index, element) {
				var newIndex = index + 1;
				$(this).addClass('campo' + newIndex);
			});
			
			$('.mensagem-erro').hide();

		};
		

		var configureAccordions = function() {
			/*Novo modelo de Accordeon seguindo as semanticas de acessibilidade incluido em: 20/03/18 - Inicio*/
			$(document).addDelegateEvent("click","a.accordion",function(event){
			    event.preventDefault();
			    $(this).next('.conteudo').stop(true, true).slideToggle(200); //abre e fecha o accordion
			    var elementoClicado = $(this);
			    if(elementoClicado.parent().hasClass('aberto')){
			        elementoClicado.attr('aria-expanded','false');
			        if(!elementoClicado.find('span').hasClass('abre-fecha')){
			        	elementoClicado.find('span').text('exibir');
			        }
			        if(elementoClicado.find('span').hasClass('seta-acordion')){
			            elementoClicado.find('span').html("ocultar<span class='bre-fecha right blue-hover icon-itaufonts_seta_up txt16 seta-acordion' aria-hidden='true'></span>");
			            elementoClicado.find("p.limite-total").removeClass("hide");
			            elementoClicado.css("top", "0px");
			        }
			        elementoClicado.parent().removeClass('aberto').addClass('fechado');
			        elementoClicado.next('div').attr('aria-hidden','true');

			    }else{
			        elementoClicado.attr('aria-expanded','true');
			        if(!elementoClicado.find('span').hasClass('abre-fecha')){
			        	elementoClicado.find('span').text('ocultar');
			        }
			        if(elementoClicado.find('span').hasClass('seta-acordion')){
			            elementoClicado.find('span').html("exibir<span class='bre-fecha right blue-hover icon-itaufonts_seta_down txt16 seta-acordion' aria-hidden='true'></span>");
			            elementoClicado.find("p.limite-total").addClass("hide");
			            elementoClicado.css("top", "-19px");
			        } 
			        elementoClicado.parent().removeClass('fechado').addClass('aberto');
			        elementoClicado.next('div').attr('aria-hidden','false');
			    }
			});
			/*Novo modelo de Accordeon seguindo as semanticas de acessibilidade incluido em: 20/03/18 - Fim*/

			/* Accordeon Páginas Internas */
			$(document).addDelegateEvent("click", "section .flex",function() {
				var elemPagInterna = $(this).parent('section');
				if(elemPagInterna.hasClass('aberto')){
					elemPagInterna.removeClass('aberto');
					elemPagInterna.addClass('fechado');

					elemPagInterna.find('.flex-home').attr("aria-expanded","false");
					elemPagInterna.find('.flex-home span.right').attr("aria-expanded","false");
					elemPagInterna.find('.conteudo').attr("aria-hidden","true");
				}else {
					elemPagInterna.removeClass('fechado');
					elemPagInterna.addClass('aberto');

					elemPagInterna.find('.flex-home').attr("aria-expanded","true");
					elemPagInterna.find('.flex-home span.right').attr("aria-expanded","true");
					elemPagInterna.find('.conteudo').attr("aria-hidden","false");
				}
				elemPagInterna.find('.conteudo').stop(true, true).slideToggle(200);
			}); // end Collapse - Internas
			
			/* Accordeon Home - Módulo Principal */
			$(document).addDelegateEvent('click', '.modulo h2.flex-home', function() {
				var texto = $(this).find("span").text();
				var elemModulo = $(this).parent();
				if(elemModulo.hasClass('aberto')){
					elemModulo.removeClass('aberto');
					elemModulo.addClass('fechado');
					if($(this).find("span").text() !== "exibir"){
						$(this).find("span").text("exibir");
					}else{
						$(this).find("span").text("ocultar");
					}

					elemModulo.find('.flex-home').attr("aria-expanded","false");
					elemModulo.find('.flex-home span.right').attr("aria-expanded","false");
					elemModulo.find('.conteudo').attr("aria-hidden","true");
					if(elemModulo.find(".botoes").length > 0){
						elemModulo.find(".botoes").attr("aria-hidden","true");
						elemModulo.find('.botoes a').attr("aria-hidden","true");
					}

				}else{
					elemModulo.removeClass('fechado');
					elemModulo.addClass('aberto');
					if($(this).find("span").text() !== "ocultar"){
						$(this).find("span").text("ocultar");
					}else{
						$(this).find("span").text("exibir");
					}

					elemModulo.find('.flex-home').attr("aria-expanded","true");
					elemModulo.find('.flex-home span.right').attr("aria-expanded","true");
					elemModulo.find('.conteudo').attr("aria-hidden","false");
					if(elemModulo.find(".botoes").length > 0){
						elemModulo.find(".botoes").attr("aria-hidden","false");
						elemModulo.find('.botoes a').attr("aria-hidden","false");
					}
				}
				$(this).parent().find('.conteudo').stop(true, true).slideToggle(200);
				$("div.fechado h2.flex-home").attr("aria-expanded","false");
			});

			/* Accordeon Home - Sidebar */
			/// acessibilidade - inclui msg que informa o status inicial
			var listaAccordionSideBar = $('.modulo h4.flex-home');
			$(listaAccordionSideBar).each(function() {
				if($(this).find('.text-access-hide').length < 1){
					$(this).append("<span class='text-access-hide' aria-hidden='true'>Pressione enter para expandir / ocultar</span>");
				}
			});

			$(document).addDelegateEvent('click', '.modulo h4.flex-home', function() {
				 var elemSidebar = $(this).parent('.modulo');
				 
				 if(elemSidebar.hasClass('aberto')){
					 elemSidebar.removeClass('aberto');
					 elemSidebar.addClass('fechado');
					 elemSidebar.find('.flex-home').attr("aria-expanded","false");
					 elemSidebar.find('.flex-home span.abre-fecha').attr("aria-expanded","false");
					 elemSidebar.find('.conteudo').attr("aria-hidden","true");
					 //$(".modulo h4.flex-home").attr('title','clique para expandir');
					 // if( elemSidebar.find('.text-access-hide').length < 1){
						// $(".modulo h4.flex-home").append("<span class='text-access-hide' aria-hidden='true'>Pressione enter para expandir!</span>");
					 // }else{
					 // 	elemSidebar.find('.text-access-hide').text("Pressione enter para expandir");
					 // }
					 $(this).blur();
					 //elemSidebar.find('.text-access-hide').focus();
				 }else{
					 elemSidebar.removeClass('fechado');
					 elemSidebar.addClass('aberto');
					 elemSidebar.find('.flex-home').attr("aria-expanded","true");
					 elemSidebar.find('.flex-home span.abre-fecha').attr("aria-expanded","true");
					 elemSidebar.find('.conteudo').attr("aria-hidden","false");
					 //$(".modulo h4.flex-home").attr('title','clique para ocultar');
					 //  if( elemSidebar.find('.text-access-hide').length < 1){
						// $(".modulo h4.flex-home").prepend("<span class='text-access-hide' aria-hidden='true'>Pressione enter para ocultar</span>");
					 // }else{
					 // 	elemSidebar.find('.text-access-hide').text("Pressione enter para ocultar");
					 // }
					 $(this).blur();
					 //elemSidebar.find('.text-access-hide').focus();
				 }
				 
				 setTimeout(function () {
					elemSidebar.find('.flex-home').focus();
				 },500);

				 elemSidebar.find('.conteudo').stop(true, true).slideToggle(200);
			});

			// abre/fecha (accordeon, chatbox) utilizando tecla enter
			$(document).addDelegateEvent('keydown', 'h2.flex-home,  h4.flex-home', function(event) {
				var tecla=(window.event)?event.keyCode:event.which;
				if (tecla == 13) {
					$(document.activeElement).click();
				}
			}); 
		};

		var configureAbreFechaChatBox = function() {
			//on click chat-box
			$(document).addDelegateEvent('click', '.chat-header', function() {
				$(this).parent().toggleClass('chat-content-open');
			});
		}

		// Configura Elementos Sidebar
		
		   var configureElementosSidebar = function(){

			   
			 //SelOpcao Chosen
			  $('#opcaoConteudo').hide();
			
			  $(document).addDelegateEvent("change" , '#selOpcao', function() {
				   
				  $('#dvBancoItau').hide();
				  $('#dvOutrosBancos').hide();
				  $('#exibeTransferencia').hide();
			
			
				  if ($('#ocultaOpcao').is(':selected')) {
					  $('#opcaoConteudo').hide();
				  }else{
					  $('#opcaoConteudo').show();
				  }
			
				  if ($('#novaTransferencia').is(':selected')) {
					  $('#opcaoConteudo').hide();
					  $('#exibeTransferencia').show();
				  }
			  });


				// Nova Transferencia
			   $('#exibeTransferencia').hide();

			   $(document).addDelegateEvent('click', '#novaTransferencia', function() {
					$('#opcaoConteudo').hide();
					$('#exibeTransferencia').show();
			   });

				$('#dvBancoItau').hide();
				$('#dvOutrosBancos').hide();
				$('input:radio[name=outrosBancos]').removeAttr("checked");
				$('input:radio[name=bancoItau]').removeAttr("checked");
			  
				$(document).addDelegateEvent('click', "#bancoItau", function(){
					$('input:radio[name=bancoItau]').attr("checked");
					$('input:radio[name=outrosBancos]').removeAttr("checked");
					$('#dvBancoItau').show();
					$('#dvOutrosBancos').hide();   
				});

				$(document).addDelegateEvent('click', "#outrosBancos", function(){
					$('input:radio[name=outrosBancos]').attr("checked");
					$('input:radio[name=bancoItau]').removeAttr("checked");
					$('#dvOutrosBancos').show();
					$('#dvBancoItau').hide();  
				});

			};
		
		// End Configura Elementos Sidebar



			/***** Navegação por TAB do Header (Menu) *****/

			var configureTabHeader = function() {
					 $('nav.menu').unbind();
					 $('nav.menu a:last').unbind();
					 $('div.ico-configuracoes').unbind();
					 $('div.dados-perfil a:last').unbind();
					
					 $('nav.menu').keyup(function(e){
						 if(e.which == 27 || e.keyCode == 27){
							 $('.sub-mnu').addClass('hide');
							 $('.mnu .btn-nav').attr("aria-expanded","false");
						 }
					});
		
					$('nav.menu a:last').keydown(function(e){
						var tecla=(window.event)?e.keyCode:e.which;
				        if((tecla.wich == 9 || tecla.keyCode == 9) && e.shiftKey!=1){
				            $('.sub-mnu').addClass('hide');
				        }
					});
					
					/*Função comentada para a area do cliente não abrir automaticamente com o TAB*/
					/*$('div.ico-configuracoes').keyup(function(e){
						if(e.which == 9 || e.keyCode == 9){
							$('div.content-config').removeClass('hide');
						}
					})*/
		
					$('div.dados-perfil a:last').keydown(function(e){
						if(e.which == 9 || e.keyCode == 9){
							$('div.content-config').addClass('hide');
						}
					});
					// end TAB

			};

			var configureLightBox = function() {
					var idModal = $('.popup-with-form').attr("href");																										
					var idTitleModal = $(idModal).attr("aria-labelledby");
					$('.popup-with-form').magnificPopup({
						type : 'inline',
						preloader : false,
						callbacks : {
							beforeOpen : function() {
								$(idTitleModal).attr('aria-hidden', 'false');
							},
							open : function () {
								/// para corrigir o defeito onde o leitor de tela falava "clicavel" sempre que o moldal era aberto - INICIO
								$('.mfp-wrap').off('click');
								setTimeout(function(){
										$(document).on('click', '.mfp-wrap', function (e) {
											if( $('.mfp-wrap').is(':visible') ){
													var container = $('.mfp-wrap');
													if (!container.is(e.target) && container.has(e.target).length === 0) {
														$.magnificPopup.instance.close();
													}
											}
									});
								}, 3000);
								$('.mfp-close').on('click', function(){	
										$.magnificPopup.instance.close();
								});
								/// para corrigir o defeito onde o leitor de tela falava "clicavel" sempre que o moldal era aberto - FIM
		
								$(idTitleModal).focus(); 
							},
							close : function() {
								$(idTitleModal).attr('aria-hidden', 'true');
							}
						}
					});
					/* Tradução de elementos - Magnific Popup */
					$.extend(
					true,
					$.magnificPopup.defaults,
					{
						tClose : 'Fechar (Esc)',
						tLoading : 'Carregando...',
						gallery : {
							tPrev : 'Anterior (Seta esquerda do teclado)',
							tNext : 'Próximo (Seta direita do teclado)',
							tCounter : '%curr% de %total%'
						},
						image : {
							tError : '<a href="%url%">A imagem</a> não pode ser carregada.'
						},
						ajax : {
							tError : '<a href="%url%">O conteúdo</a> não pode ser carregado.'
						}
					});
			};

		var configureCharacterCounter = function() {
			/** ************************************************************** */
				$(".maxlength").unbind();
				$(".maxlength").keyup(function(event) {
	
					var target = $(this).parent().find("#char-counter");
					var max = target.attr('maxchar');
					var len = $(this).val().length;
					var remain = max - len;
	
					if (len > max) {
						var val = $(this).val();
						$(this).val(val.substr(0, max));
						remain = 0;
					}
					target.html(remain);
				});
		};

		var configureShowAndHide = function() {
			$(document).addDelegateEvent("click",".seleciona-linha-clique", function() {
				var contSelects = $(this).parents(".seleciona-linha");

				if (!contSelects.hasClass("multipla-selecao")) {
					$(this).toggleClass("ativo");
				} else {
					if (!$(this).hasClass("ativo")) {
						contSelects.find(".seleciona-linha-clique")
								.removeClass("ativo");
						$(this).addClass("ativo");
						$(".seleciona-radio")
								.attr('checked', 'checked');
					} else {
						$(this).removeClass("ativo");
						$(".seleciona-radio").removeAttr('checked');
					}
				}
			});
		};

		var configureLinks = function() {
			/** ************************************************************** */
			/** *** Voltar ao topo / Âncoras **** */
			/** ************************************************************** */
			$(document).addDelegateEvent('click', 'a[href*="#"]:not([href="#"])', function() {
				if (location.pathname.replace(/^\//, '') == this.pathname
						.replace(/^\//, '')
						&& location.hostname == this.hostname) {
					var target = $(this.hash);
					target = target.length ? target
							: $('[name=' + this.hash.slice(1)
									+ ']');
					if (target.length) {
						$('html,body')
								.animate(
										{
											scrollTop : target
													.offset().top - 120
										}, 1000);
						return false;
					}
				}
			}); // end "Voltar ao topo"

		};
		
		
		//
		var configureContadorValorCampo = function(){
			
			/*****************************************************************/
			/***** Aumenta e Diminui valor do Campo (Contador) *****/
			/*****************************************************************/	

			$('#inp-contador').val(0);
			
			$(document).addDelegateEvent("click","#bt-mais", function(){
				$('#inp-contador').val(parseInt($('#inp-contador').val())+1);
			});
			
			$(document).addDelegateEvent('click', "#bt-menos", function(){
				$('#inp-contador').val(parseInt($('#inp-contador').val())-1);
				if ($('#inp-contador').val() < 1) {
					$('#inp-contador').val(0);		
				}
			});
			
			// end Contador
		};
		
		var configurePrintThis=function(){
			
			/*****************************************************************/
			/***** Impressão de janela Modal (Lightbox) - PrintThis *****/
			/*****************************************************************/

			$(document).addDelegateEvent( "click", "#bt-print", function () {
				$("#print-modal").printThis();
			});

			// end PrintThis
		};

		var configureChosen = function() {
				if ($('.chosen-select').closest('div').is('.fake-select')){
					$('.chosen-select').prev("span").remove();
					$('.chosen-select').unwrap();
				};
				$('.chosen-select').chosen({width:"100%", no_results_text: "Registro não encontrado"});
			
		};
		
		// A rotina abaixo mostra uma tela com um gif de wait.
		// Início
		var configureLoading = function() {
			$(document).addDelegateEvent('click', '.btnMostraWait', function () {
				executaLoading('show','Aguarde');
				setTimeout(function () {executaLoading('hide','')},10000);
			}) 
		};
		
		var executaLoading = function (acao, mensagem) {
			//function executaLoading(acao,mensagem) {
				var sConteudo = "";
				if (acao == "show") {
					sConteudo = '<div id="divGif" class="modulo modulo-lightbox mfp-hide center">\n';
					sConteudo = sConteudo + '<section id="sectionGif">\n';
					sConteudo = sConteudo + '</section>\n';
					sConteudo = sConteudo + '</div>\n';
					$('body').append (sConteudo);
					$("#divGif" ).hide();
					$("#divGif" ).height("140px");
					$("#divGif" ).width("180px");
					$("#divGif" ).removeClass("mfp-hide");
					$("#divGif" ).show();
					$( "#sectionGif" ).append ("<div id='divimg'><img id='img1' src='https://jarvisfabrica.itau/summer-cdn/commons/img/loading-big.gif' /></div>").show();
					if (mensagem != undefined && mensagem != "") {
						sConteudo = '<h3 id="h3MsgGif">\n';
						sConteudo = sConteudo + '<span class="destaque">' + mensagem + '</span>';
						sConteudo = sConteudo + '</h3>';
						$( "#sectionGif" ).append(sConteudo);
					}
				};
				if (acao == "hide") {
					$(".mfp-close").click();
					$("#divGif" ).hide();
					$("#divGif" ).remove();
				}
			//}
		};
		
		var configureJcarousel = function() {
				$('.jcarousel').jcarousel({
					  wrap: 'circular',
					  animation: {
							duration: 800,
							easing:   'swing',
							complete: function() { }}
								 
					  })
				   .jcarouselAutoscroll({
						  interval: 5000,
						  target: "+=1",
						  autostart: true
				  });
	
			   	$('.jcarousel-control-next').jcarouselControl({
					target: '+=1'
				});
		};
		
		var marcarComoFavorito = function() {

			$(document).addDelegateEvent('click', ".icone-favoritos", function() {
					
				if ($(this).hasClass('ativo')) {
					$(this).removeClass('ativo');
				}else{
					$(this).addClass('ativo');
				}

			});
				
		};
		
		var configureMudaBoxComDiv = function(){

			$(".mudaBoxComDiv1").addClass('ativo');

			if ($(".ativaBoxComDiv1").not('.block')){
				$(this).addClass('block');
				$(this).removeClass('hide');
			};
			
			$(".ativaBoxComDiv1").siblings().removeClass('block');
			$(".ativaBoxComDiv1").siblings().addClass('hide');


			$(document).addDelegateEvent('click', '.mudaBoxComDiv1', function(){
				if ($(this).not('.ativo')) {
					$(this).addClass('ativo');
				}
				
				$(".ativaBoxComDiv1").removeClass('hide');
				$(".ativaBoxComDiv1").addClass('block');

				$(".mudaBoxComDiv1").siblings().removeClass('ativo');

				$(".ativaBoxComDiv1").siblings().removeClass('block');
				$(".ativaBoxComDiv1").siblings().addClass('hide');

			});

			$(document).addDelegateEvent('click', '.mudaBoxComDiv2', function(){
				if ($(this).not('.ativo')) {
					$(this).addClass('ativo');
				}
				
				$(".ativaBoxComDiv2").removeClass('hide');
				$(".ativaBoxComDiv2").addClass('block');

				$(".mudaBoxComDiv2").siblings().removeClass('ativo');

				$(".ativaBoxComDiv2").siblings().removeClass('block');
				$(".ativaBoxComDiv2").siblings().addClass('hide');

			});

			$(document).addDelegateEvent('click', '.mudaBoxComDiv3', function(){
				if ($(this).not('.ativo')) {
					$(this).addClass('ativo');
				}
				
				$(".ativaBoxComDiv3").removeClass('hide');
				$(".ativaBoxComDiv3").addClass('block');

				$(".mudaBoxComDiv3").siblings().removeClass('ativo');

				$(".ativaBoxComDiv3").siblings().removeClass('block');
				$(".ativaBoxComDiv3").siblings().addClass('hide');

			});

			$(document).addDelegateEvent('click', '.mudaBoxComDiv4', function(){
				if ($(this).not('.ativo')) {
					$(this).addClass('ativo');
				}
				
				$(".ativaBoxComDiv4").removeClass('hide');
				$(".ativaBoxComDiv4").addClass('block');

				$(".mudaBoxComDiv4").siblings().removeClass('ativo');

				$(".ativaBoxComDiv4").siblings().removeClass('block');
				$(".ativaBoxComDiv4").siblings().addClass('hide');

			});

			$(document).addDelegateEvent('click', '.mudaBoxComDiv5', function(){
				if ($(this).not('.ativo')) {
					$(this).addClass('ativo');
				}
				
				$(".ativaBoxComDiv5").removeClass('hide');
				$(".ativaBoxComDiv5").addClass('block');

				$(".mudaBoxComDiv5").siblings().removeClass('ativo');

				$(".ativaBoxComDiv5").siblings().removeClass('block');
				$(".ativaBoxComDiv5").siblings().addClass('hide');

			});

			$(document).addDelegateEvent('click', '.mudaBoxComDiv6', function(){
				if ($(this).not('.ativo')) {
					$(this).addClass('ativo');
				}
				
				$(".ativaBoxComDiv6").removeClass('hide');
				$(".ativaBoxComDiv6").addClass('block');

				$(".mudaBoxComDiv6").siblings().removeClass('ativo');

				$(".ativaBoxComDiv6").siblings().removeClass('block');
				$(".ativaBoxComDiv6").siblings().addClass('hide');

			});

			$(document).addDelegateEvent('click', '.mudaBoxComDiv7', function(){
				if ($(this).not('.ativo')) {
					$(this).addClass('ativo');
				}
				
				$(".ativaBoxComDiv7").removeClass('hide');
				$(".ativaBoxComDiv7").addClass('block');

				$(".mudaBoxComDiv7").siblings().removeClass('ativo');

				$(".ativaBoxComDiv7").siblings().removeClass('block');
				$(".ativaBoxComDiv7").siblings().addClass('hide');

			});

		};
		  
	   	var configureCliqueBox = function(){
	   		VitrineCliqueBox.init();
	   	}
	   	
		var configureCarrinhoCompras = function() {
			// abre o carrinho da sidebar no load da pagina 
			$('.car-vendas-sidebar .conteudo').slideDown();
			$('.car-vendas-sidebar').toggleClass('aberto').toggleClass('fechado');

			// fecha carrinho de vendas e remove do Html (topo e sidebar)
			$(document).addDelegateEvent('click','.car-vendas-footer .btnFechaCarrinho', function(){
				// fecha carrinho sidebar
			  	$('.car-vendas-sidebar .conteudo').slideUp();
			  	$('.car-vendas-sidebar').fadeOut(500, function(){ 
		  			$('.car-vendas-sidebar').remove();
	  			});
	  			// fecha carrinho topo
	  			$(this).closest('.car-vendas-container').fadeOut('fast', function(){
					$(this).remove();
				});
			});
		}
		
		var configuraAcessibilidadeCarrinhoTopoTela = function(){
			
			$(document).addDelegateEvent('focusin','.car-vendas',function(){
				$('.car-vendas').addClass('aberto');
			});
			
			$(document).addDelegateEvent('focusout','.car-vendas',function(){
				$('.car-vendas').removeClass('aberto');
			});
		}
		
		
		var configureAccordionAcessibilidade = function() {
			var accordion = {
				slideContent: function(elem){
					elem.siblings('.accordion-content').stop(true, true).slideToggle(200);
				},
				changeText: function(elem){
					var span = elem.children("span"),
						text = span.text();
					switch(text){
						case "ocultar":
							text = "exibir";
							break;
						case "exibir":
							text = "ocultar";
							break;
					}

					span.text(text);
				},
				toggleBorder: function(elem){
					elem.toggleClass("accordion-title--noBorderBottom");
				},
				toggleArrowIcon: function(elem){
					var situation = elem.find("span").hasClass("accordion-icon--arrowUp"),
						insert,
						remove;

					switch(situation){
						case true:
							remove = "accordion-icon--arrowUp";
							insert = "accordion-icon--arrowDown";
							break;
						case false:
							insert = "accordion-icon--arrowUp";
							remove = "accordion-icon--arrowDown";
							break;

					}

					elem.find("span").removeClass(remove).addClass(insert);
				},
				hover: function(elem){
				  elem.toggleClass("accordion--hover");
				}
			}

			var accordionTitle	 = $(".js-accordion").find(".accordion-title"),
				accordionTitleIcon = $(".accordion--icon").find(".accordion-title"),
				accordionNoBorder  = $(".js-accordion-noborder").find(".accordion-title"),
				accordionHover	 = $(".js-accordion-hover").find(".accordion-title");

			accordionTitle.on("click", function(){
			  accordion.changeText($(this));
			  accordion.slideContent($(this));
			});
			accordionTitleIcon.on("click", function(){
			  accordion.changeText($(this));
			  accordion.slideContent($(this));
			  accordion.toggleBorder($(this));
			  accordion.toggleArrowIcon($(this));
			});
			accordionNoBorder.on("click", function(){
			  accordion.changeText($(this));
			  accordion.slideContent($(this));
			  accordion.toggleBorder($(this).find("h2"));
			});
			accordionHover.on("click", function(){
			  accordion.changeText($(this));
			  accordion.slideContent($(this));
			  accordion.toggleBorder($(this).find("h2"));
			  accordion.hover($(this).parent());
			});

			//////////////////////Adiciona informação complemetar no modulo sidebar (solução para acessibilidade no IE + Jaws)
			/*if($(".modulo h4.flex-home p.text-access-hide").length < 1){
				$(".modulo h4.flex-home").prepend("<p class='text-access-hide'>Pressione enter para expandir / ocultar</p>");
			}*/
			/// limpo o title
			$(".modulo-sidebar h4.flex-home span.abre-fecha").attr('title','');

		};
			
		function footerListen(){
			$('body').off("click.footerListen");
			$('body').on("click.footerListen", function() { 
				var setIntervalFooter = setInterval(function(){
					uiConfiguration.configureFooter();
				}, 20);
				
				setTimeout(function (){
					window.clearInterval(setIntervalFooter);
					uiConfiguration.configure(true);
				}, 600);
			});
		}

		var startTabindexDinamico = function(){
			defineTabindexDinamico(0);
		}

		//Wai-aria dinamico para botões (role='button')
		var configureRoleButton = function(){
			$('.btn,.btn-secundario,.btn-fluxo,.btn-pequeno,.btn-ico,.btn-action').attr('role','button');
		}

		var configureWarning = function(){
			if (WarningMain && window._campanha) {
				WarningMain.init();
			};
		}		

		if (executaFns==true) {
			configureTituloPaginaDinamico();
			configureTooltip();
			thisClass.configureDatePicker();
			configurePlaceHolder();
			configureMasks();
			configureTabHeader();
			configureLightBox();
			configureCharacterCounter();
			configureChosen();
			configureJcarousel();
			configureCliqueBox();
			//configureMudaBoxComDiv();
			configureAccordionAcessibilidade();
			//chatbox
			//chatBox.startChat();
			//impede 'paste' em campo input
			configureNoPaste();
			//tabIndex Dinamico para o miolo da pagina
			startTabindexDinamico();
			//Warnings
			//configureWarning();
			configurePaginacaoAcessivel();
			configureIrParaConteudoAcessivel();
			configureRoleButton();
			configuraEventoCtrlHome();
			customMask();
		}
		
		if($("html").hasClass("uiConfiguration-runed") == false){
			$("html").addClass("uiConfiguration-runed");
			$("body").off();
			configureTituloPaginaDinamico();
			configureTooltip();
			configureAbas();
			configureAbasAcessivel();
			configurePaginacaoAcessivel();
			configureValoresMonetarios();
			configureMenu();
			configureSubMenuPJ();
			thisClass.configureDatePicker();
			configurePlaceHolder();
			configureMasks();
			configureDropDown();
			configureCommons();
			footerListen();
			//configureSelects();
			configureForms();
			configureAccordions();
			configureLightBox();
			configureCharacterCounter();
			configureShowAndHide();
			configureLinks();
			// novas funcoes 
			configureContadorValorCampo();
			configurePrintThis();
			//configureAutoTab(); // plugin
			configureChosen();
			configureCliqueBox();
			marcarComoFavorito();
			thisClass.configureMudaBoxComDiv();
			configureElementosSidebar();
			configureTabHeader();
			configureCarrinhoCompras();
			configuraAcessibilidadeCarrinhoTopoTela();
			//chatbox
			//chatBox.startChat();
			configureAbreFechaChatBox();
			//novo autotab
			iniciaAutotab();
			// A rotina que configura gif de wait
			configureLoading();
			configureJcarousel();
			// Rotina está fora do bloco
			thisClass.configureFooter();
			thisClass.configureAjaxComplete();
			// Elementos com JS alterados para Acessibilidade
			configureAccordionAcessibilidade();
			//impede 'paste' em campo input
			configureNoPaste();
			//tabIndex Dinamico para o miolo da pagina
			startTabindexDinamico();
			//role button dinamico
			configureRoleButton();
			configureIrParaConteudoAcessivel();
			configureAreaClienteAcessibilidade();		
			customMask();
		};
		
		$(function(){
			$.event.trigger({
				type: "ui-cofiguration:executado",
				forceRefresh : (executaFns == true) ? true : false
			});
		});
		
	},
	configureMudaBoxComDiv : function(){

		$(".mudaBoxComDiv1").addClass('ativo');

		if ($(".ativaBoxComDiv1").not('.block')){
			$(this).addClass('block');
			$(this).removeClass('hide');
		};
		
		$(".ativaBoxComDiv1").siblings().removeClass('block');
		$(".ativaBoxComDiv1").siblings().addClass('hide');


		$(document).addDelegateEvent('click', '.mudaBoxComDiv1', function(){
			if ($(this).not('.ativo')) {
				$(this).addClass('ativo');
			}
			
			$(".ativaBoxComDiv1").removeClass('hide');
			$(".ativaBoxComDiv1").addClass('block');

			$(".mudaBoxComDiv1").siblings().removeClass('ativo');

			$(".ativaBoxComDiv1").siblings().removeClass('block');
			$(".ativaBoxComDiv1").siblings().addClass('hide');

		});

		$(document).addDelegateEvent('click', '.mudaBoxComDiv2', function(){
			if ($(this).not('.ativo')) {
				$(this).addClass('ativo');
			}
			
			$(".ativaBoxComDiv2").removeClass('hide');
			$(".ativaBoxComDiv2").addClass('block');

			$(".mudaBoxComDiv2").siblings().removeClass('ativo');

			$(".ativaBoxComDiv2").siblings().removeClass('block');
			$(".ativaBoxComDiv2").siblings().addClass('hide');

		});

		$(document).addDelegateEvent('click', '.mudaBoxComDiv3', function(){
			if ($(this).not('.ativo')) {
				$(this).addClass('ativo');
			}
			
			$(".ativaBoxComDiv3").removeClass('hide');
			$(".ativaBoxComDiv3").addClass('block');

			$(".mudaBoxComDiv3").siblings().removeClass('ativo');

			$(".ativaBoxComDiv3").siblings().removeClass('block');
			$(".ativaBoxComDiv3").siblings().addClass('hide');

		});

		$(document).addDelegateEvent('click', '.mudaBoxComDiv4', function(){
			if ($(this).not('.ativo')) {
				$(this).addClass('ativo');
			}
			
			$(".ativaBoxComDiv4").removeClass('hide');
			$(".ativaBoxComDiv4").addClass('block');

			$(".mudaBoxComDiv4").siblings().removeClass('ativo');

			$(".ativaBoxComDiv4").siblings().removeClass('block');
			$(".ativaBoxComDiv4").siblings().addClass('hide');

		});

		$(document).addDelegateEvent('click', '.mudaBoxComDiv5', function(){
			if ($(this).not('.ativo')) {
				$(this).addClass('ativo');
			}
			
			$(".ativaBoxComDiv5").removeClass('hide');
			$(".ativaBoxComDiv5").addClass('block');

			$(".mudaBoxComDiv5").siblings().removeClass('ativo');

			$(".ativaBoxComDiv5").siblings().removeClass('block');
			$(".ativaBoxComDiv5").siblings().addClass('hide');

		});

		$(document).addDelegateEvent('click', '.mudaBoxComDiv6', function(){
			if ($(this).not('.ativo')) {
				$(this).addClass('ativo');
			}
			
			$(".ativaBoxComDiv6").removeClass('hide');
			$(".ativaBoxComDiv6").addClass('block');

			$(".mudaBoxComDiv6").siblings().removeClass('ativo');

			$(".ativaBoxComDiv6").siblings().removeClass('block');
			$(".ativaBoxComDiv6").siblings().addClass('hide');

		});

		$(document).addDelegateEvent('click', '.mudaBoxComDiv7', function(){
			if ($(this).not('.ativo')) {
				$(this).addClass('ativo');
			}
			
			$(".ativaBoxComDiv7").removeClass('hide');
			$(".ativaBoxComDiv7").addClass('block');

			$(".mudaBoxComDiv7").siblings().removeClass('ativo');

			$(".ativaBoxComDiv7").siblings().removeClass('block');
			$(".ativaBoxComDiv7").siblings().addClass('hide');

		});

	},
	startTabIndexDinamico: function(){
		//tabIndex Dinamico para o miolo da pagina
		defineTabindexDinamico(0);
	},
	ajustaIE9 : function(){if(typeof(isInternetExplorer9OrBellow) == 'function' && isInternetExplorer9OrBellow()){var ec=document.querySelectorAll("section.container")[0];ec&&ec.setAttribute("style","margin-top:-20px");var es=document.getElementsByClassName("btn-sair")[0];es&&es.setAttribute("style","margin-top:-50px")};}
	,
	configureDatePicker : function() {
		var seletor = $(".datepicker, input[id*='datepicker']");
		if(seletor.length > 0){
			seletor.each(function() {
				if($(this).hasClass("datepicker-runed") == false){
					uiConfiguration.createPikaDay($(this));
				}
			});
		}
			
	},
	createPikaDay : function(element) {
		if ($(element)) {
			$(element).addClass("datepicker-runed");
			var $datepicker = $(element).pikaday({
				firstDay : 1,
				// alteração de posicionamento do calendario para fixa-lo acima do input
				// alteração realizada dia 18/02/2016 conforme alinhamento com UX
				position : "top left",
				format : "DD/MM/YYYY",
				minDate : new Date(1940, 0, 1),
				maxDate : new Date(2099, 11, 31),
				yearRange : [ 1940, 2099 ],
				i18n: {
					previousMonth : 'Anterior',
					nextMonth	  : 'Próximo',
					months		  : ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
					weekdays	  : ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
					weekdaysShort : ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
				}
			});
		};
	},
	configureFooter : function() {
		//Necessário multiplicar o footer x2 por conta de um espaço de warning posicionado acima dele;
		var alturaPagina = $("#content").height() + $('header').height() + ($('footer').height() * 2);
		if (alturaPagina < $(window).height() ) {
			$("body > footer.auto-position").addClass("footer-fix");
		} else {
			$("body > footer.auto-position").removeClass("footer-fix");
		}
	},
	
	configureAjaxComplete: function() {
		
		$(document).ajaxStop(function(){
			if(sessionStorage.isPessoaFisica === "false" && !$.navigator.isIE(9)){
				history.pushState({},"","router#30horas");
			}
		});
	
		$( document ).ajaxComplete(function( event, xhr, settings ) {	
				
			uiConfiguration.configureFooter();
			setTimeout(function (){
				uiConfiguration.configure(true);
				uiConfiguration.configureFooter();
				}, 500);
		});
		
		$(document).ajaxSend(function( event, jqxhr, settings ){
			var urlSummer = (settings.url.indexOf("summer-cdn"));
			if(settings.headers != undefined){
				if((settings.headers.scrollToTop != undefined && settings.headers.scrollToTop == false) || urlSummer > -1){
					return false;
				}
			} else if(urlSummer > -1){
				return false;
			}
			
			$("html, body").animate({scrollTop: 0}, 10, 'swing');
		});
	}

};

var configuraEventoCtrlHome = function(){
	$('.fix-ctrl-home').on('keydown', function(event){ 
		event = event || window.event; //IE
	    var key = event.which || event.keyCode; // keyCode detection
	    var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // CTRL detection
		ctrl = ctrl || event.metaKey; //MAC CTRL detection
	    if ( key == 36 && ctrl ) { //CTRL+HOME
			$("body a.text-access-hide:first").focus();
	    }
	}); 
}
//TABINDEX DINAMICO PARA O MIOLO DA PAGINA
var defineTabindexDinamico = function(zerarTabIndex, foco){
	
	$(".btn-nav").off()
 
	var elementoEmFoco ="", tabconteudo, tabpage, tabindexHeader = 0, tabindexSair = 0, i = 0;
			 
	//validacoes para saber se tabindex ira ser aplicado em todo body ou apenas apos o header .		 	
	tabindexSair = $(".btn-sair a").attr("tabindex");
	if (typeof tabindexSair == typeof undefined) {
		tabindexSair = 0;
	} else {
		tabindexSair = parseInt(tabindexSair);
	};
	
	tabindexHeader = $(".mnu a").attr("tabindex");
	if (typeof tabindexHeader == typeof undefined) {
		tabindexHeader = 0;
		tabindexSair = 0;
	};
   
	if (zerarTabIndex == 0){
		tabindexSair = 0;
	};

	if (tabindexSair == 0) {
		tabconteudo = $("header, #content, #complementarySection, footer, #AVIContainer, #AVIMessengerMain");
		tabpage =  $("[tabindex != -1]");
		// 3 devido aos links do menu acessivel 1=ir para o conteudo, 2=ir para o menu , 3=ir para a busca
		i = 3;
	} else {
		i = tabindexSair;
		tabconteudo = $("#content, #complementarySection, footer, #AVIContainer, #AVIMessengerMain");
		tabpage =  $("#content [tabindex != -1], footer [tabindex != -1]");
		// TODO Necessário rever acessibilidade
		// elementoEmFoco = "#irParaConteudo";
	}
	
	$("#irParaConteudo").attr("tabindex", 0);
	$("#irParaMenu").attr("tabindex", 0);
	$("#irParaBusca").attr("tabindex", 0);

	//pega lista de elemento e aplica o tabindex
	var lista = tabconteudo.find('button, a, span.seta-link, select, input:visible, h2.flex-home,  h4.flex-home, .incluir-tabindex').get();
	$(lista).each(function() {
		if (!( $(this).hasClass("busca-campo") || $(this).hasClass("nao-incluir-tabindex") || $(this).hasClass("invisible") )) {
			$(this).attr("tabindex", 0);
		}
	});
  
	// colocar foco para link irParaConteudo
	if(elementoEmFoco != ""){
		$(elementoEmFoco).focus();
	}
	//function usada pelo item irParaConteudo
	function proximoElemento(){
		$(elementoEmFoco).next();
	}
  
	//evento para dispara o clique quando o elemento for li e conter um link
	$(this).off("keydown.menu");
	$(this).on("keydown.menu", function(e){
		//Descomentar essa parte ao usar o frame1 criado para facilitar o teste tabindex, ele exibe em qual elemento o tabindex se encontra
		// if(e.keyCode == 9){
			// parent.frame1.contentDocument.body.textContent = $(e.target).attr("tabindex")+$(e.target).html();
		// }
		if (e.keyCode == 13 || e.keyCode == 32) {
			if ($(e.target).is("li")) {
				if($(e.target).children("a").length > 0){
					$(e.target).children("a")[0].click();
				}else{
					$(e.target).click()
				}
			};
			if(!$('.sub-mnu').hasClass('hide')){
				$('.sub-mnu').addClass('hide');
			};
		}
	});
	if (typeof foco != typeof undefined) {
		$(foco).focus();
	}
	
				
};

//Atualiza o tabindex dos links da busca (input busca, itens default, auto complete, link ver todos, lupa)
//Utiliza como referencia o elemento anterior a barra de busca (ultima ancora existente na div com a classe .logo)
//Pre requisito: A funcao 'defineTabIndexDinamico()' precisa reservar um 'range' para os itens da busca
var defineTabIndexBusca = function(){

	var tabIndexPreBusca = $(".logo a").last().attr("tabindex");
	var contadorTabBusca = tabIndexPreBusca;
		
	if (typeof tabIndexPreBusca !== typeof undefined) {
		
		//input busca
		//$("#input-busca").attr("tabindex", 0); // comentado para arrumar erros de tabulação nas transações rapidas
		
		//itens default, auto complete, link ver todos
		$(".busca-header a").each(function() {	
			$(this).attr("tabindex", 0);					
		});
		
		//Ajusta o tab index da lupa
		$("#lupa-busca").attr("tabindex", 0);	
	}	
};


///events invoke footer position
$(window).on("resize", function() {
	uiConfiguration.configureFooter();
});




/* ==============================================================================================
 * Events de click
 * 
 * Descrição: Events de click no link de acessibilidade no topo da pagina
 *
 * Data: 23 ago 2016
 *
 *
 * Dependencia JS: jQuery 1.7 ou maior.
 *
 * =============================================================================================== */

$(document).on("click", '#irParaConteudo', function(event) {
	event.preventDefault();
	var hasH1 = $("body h1").size();
	var divPrincipal = $("body .content-jarvis");
	if(hasH1 > 0){
		$("body h1").first().addClass('tabindex-provisorio').attr('tabindex', '-1').focus();
	} else if(divPrincipal){
		$(divPrincipal).addClass('tabindex-provisorio').attr('tabindex', '-1').focus();
	} else {
		$("#content").first().addClass('tabindex-provisorio').attr('tabindex', '-1').focus();
	}
	setTimeout(function(){
		$('.tabindex-provisorio').removeAttr('tabindex').removeClass('tabindex-provisorio');
	}, 1000)
});

$(document).on("click", '#irParaMenu', function(event) {
	event.preventDefault();
	$("nav ul li.mnu a:first").focus();
});

$(document).on("click", '#irParaBusca', function(event) {
	event.preventDefault();
	if($("#input-busca").length){
		$("#input-busca").focus();
	}else{
		$("#queryPesquisa").focus();
	}
});




/* ==============================================================================================
 * Events trigger
 * 
 * Descrição: Trigger de carregamento de conteudo para acessibilidade
 *
 * Data: 24 mai 2016
 *
 * Tipos de trigger: loader:iniciado
 *					 loader:finalizado
 *
 *					 conteudo:carregando
 *					 conteudo:carregado
 *
 *					 pagina:carregando
 *					 pagina:carregada
 *
 *					 popoup:carregando
 *					 popoup:carregado
 *
 * Dependencia JS: jQuery 1.7 ou maior, core.js 2.2.1-SNAPSHOT ou maior.
 *
 * =============================================================================================== */
$(document).on("conteudo:carregado", function(){

	var elementoHrefAcessivel = $("#irParaConteudo");
	///se o link não existir mando o foco para o logo
	if (elementoHrefAcessivel.length  < 1) {
		$("div.logo a").focus();
	}else{
		$("#input-busca").val("");
		setFocusDocument();
	};

	if (typeof renderizaFaixaLancamentoInterval === "function" && listaFluxosLancamento) {
	    $(".tarja-lancamento").hide();
		renderizaFaixaLancamentoInterval();
		customInterval(renderizaFaixaLancamentoInterval, 2000, 3);
	}
	
	$("#input-busca").val(""); //Limpa o campo da busca

	//verifica o zoom da tela (acessibilidade)
	verificaZoom();

	//console.log("conteudo carregado");
});


$(document).on("pagina:carregada", function(){

	var elementoHrefAcessivel = $("#irParaConteudo");
	///se o link não existir mando o foco para o logo
	if (elementoHrefAcessivel.length  < 1) {
		$("div.logo a").focus();
	} else {
		$("#irParaConteudo").focus();
	};

	//verifica o zoom da tela (acessibilidade)
	verificaZoom();

	//console.log("pagina carregada");
});



/* ==============================================================================================
 * Verifica zoom do browser
 * 
 * Descrição: Por motivos de acessibilidade, usuarios com dificuldades visuais podem utilizar o recurso de zoom padrão do browser,
 * esse script detecta o zoom e corrige a tela para que o usuario consiga navegar em toda a pagina. 
 *
 * Data: 08 ago 2016
 *
 * Modificado: 24/05/2017
 *
 * Dependencia JS: jQuery 
 *
 * =============================================================================================== */
var verificaZoom = function() {
	var minhaLargura = 0, minhaAltura = 0;
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		minhaLargura = window.innerWidth;
		minhaAltura = window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+
		minhaLargura = document.documentElement.clientWidth;
		minhaAltura = document.documentElement.clientHeight;
	}

	//verifica o zoom em areas logadas
	if ( $('div.btn-sair').length ){

	  	boxSair = $('div.btn-sair');		 // box sair
		offSetSair = boxSair.offset().left;   // posição em PX do bt sair

		if(minhaLargura < offSetSair){
			$("header.bkl").addClass('header-fixo-acessibilidade');
			
			// FluxoCambio - PF
			if( $('#alerta-cotacao').length ) {
					$('#alerta-cotacao').css('top','0')
			}
			//verifica se o footer tem a classe footer-fix
			if ($('footer').hasClass("footer-fix")) {
				//renomeia classe do footer
				$('footer').removeClass('footer-fix').addClass('footer-fix-removed');
			}
		}else{
			
			$("header.bkl").removeClass('header-fixo-acessibilidade');

			// FluxoCambio - PF
			if( $('#alerta-cotacao').length ) {
					$('#alerta-cotacao').removeAttr('style');
			}
			//verifica se o footer tem a classe footer-fix-removed
			if ($('footer').hasClass("footer-fix-removed")) {
				//renomeia classe do footer
				$('footer').removeClass('footer-fix-removed').addClass('footer-fix');
			}
		}

	}else{ // verifica zoom em areas não logadas
		if(minhaLargura < 1000){
			$("header.bkl").addClass('header-fixo-acessibilidade');
			//verifica se o footer tem a classe footer-fix
			if ($('footer').hasClass("footer-fix")) {
				//renomeia classe do footer
				$('footer').removeClass('footer-fix').addClass('footer-fix-removed');
			}
		}else{
			
			$("header.bkl").removeClass('header-fixo-acessibilidade');
			//verifica se o footer tem a classe footer-fix-removed
			if ($('footer').hasClass("footer-fix-removed")) {
				//renomeia classe do footer
				$('footer').removeClass('footer-fix-removed').addClass('footer-fix');
			}
		}
	}

	//tratamento para o ligthbox
	if($(".mfp-wrap").length === 1){
		if(minhaLargura < 1000){
			$('html').css("overflow","");
			$(".mfp-wrap").css("position","absolute");

		}else{
			$('html').css("overflow","hidden");
			$(".mfp-wrap").css("position","fixed");
		}

	}
}

var customInterval = function (func, wait, times) {
	var interv = function (w, t) {
		return function () {
			if (typeof t === "undefined" || t-- > 0) {
				setTimeout(interv, w);
				try {
					func.call(null);
				} catch (e) {
					t = 0;
					throw e.toString();
				}
			}
		};
	}(wait, times);

	setTimeout(interv, wait);
};

var setFocusDocument = function () {
	$("header .conteudo-carregado").attr('tabindex', '-1').focus();
	setTimeout(function () {
		$("header .conteudo-carregado").removeAttr('tabindex');
	}, 1000);
	checaTituloPagina();
}

var checaTituloPagina = function () {
	var valTitle = "Banco Itaú";
	var current = $("#feedbackAcessibilidadeGlobal").text();
	if ($("#content h1").text().trim() != "") {
		valTitle = $("#content h1").text() + " - Banco Itaú";
	}
	if (valTitle == current) {
		return false;
	}
	feedbackAcessibilidade(valTitle);
}

var feedbackAcessibilidade = function (mensagem) {
	if (!mensagem) {
		return false;
	}
	$("#feedbackAcessibilidadeGlobal").html(mensagem);
	setTimeout(function () {
		$("#feedbackAcessibilidadeGlobal").html('');
	}, 500);
}

$(window).resize(function() {
	verificaZoom();
});

$(window).load(function() {
	verificaZoom();
});

/**
 * Este script foi desenvolvido para manter a convivência entre os módulos
 * pessoa-juridica-warning-app e carrinho-app.
 * Quando todos os carrinhos de pessoa-juridica-warning-app forem migrados para carrinho-app,
 * o uso deste script deve ser substituido por chamada direta ao carrinho-app.
 */
(function($public, $private) {
	
	
	$public.BoxCarrinho = {
		renderBoxCarrinho : function(options) {
			$private.initPessoaJuridicaWarningApp(options);
		}
	};
	
	$private.initBoxCarrinho = function(options) {
		$.Ajax({
			type : "POST",
			timeout: 30000,
			showLoading : false,
			headers: {
				"op": options.opCarrinhoApp,
				"ajaxRequest" : true,
				scrollToTop : false
			},				
			data: {
				isHome: options.isHome,
				localExibicao : options.localExibicaoCarrinhoApp
			},
			success: function(response) {
				if(response.trim() != '') {
					$(options.seletorContainer).html(response);
				}
				else {
					$private.initPessoaJuridicaWarningApp(options);
				}
			},
			error: function(jq, status, error) {
				$private.initPessoaJuridicaWarningApp(options);
			}
		});
	};

	$private.initPessoaJuridicaWarningApp = function(options) {
		$.Ajax({
			type : "POST",
			timeout: 30000,
			showLoading : false,
			headers: {
				"op": options.opPessoaJuridicaWarning,
				"ajaxRequest" : true,
				scrollToTop : false
			},
			data: {
				home: options.isHome,
				localExibicao : options.localExibicaoPessoaJuridicaWarning
			},
			success: function(response) {
				$(options.seletorContainer).html(response);
			}
		});
	};
	
	
	
})(window, {});


var verificaBoxCarrinho = function() {

	//Adobe View: utilizado para verificar a implementação do carrinho
	if (typeof(window.carrinhoView) == "undefined") {
		window.carrinhoView = undefined;

		var boxCarrinhoExiste = false;
		var carrinhosPags = new Array 
		("boxHomeCarrinhoPF",
		"boxCreditoCarrinhoPF",
		"boxContaCorrenteCarrinhoPF",
		"boxInvestimentosHomeCarrinhoPF",
		"boxCartoesCarrinhoPF",
		"boxConsorcioCarrinhoPF",
		"boxPicCarrinhoPF",
		"boxSegurosCarrinhoPF",
		"boxPrevidenciaPF");

		carrinhosPags.each(function(index){
		    if ($("#" + index).length > 0) {
		        boxCarrinhoExiste = true;
		    }
		});

		if (!boxCarrinhoExiste) {
		    window.carrinhoView = "";
		    return false;
		} else {
			return true;
		}
	}
};

verificaBoxCarrinho ();
﻿vpwreturn = (function() {
    var o = {},
        actions_enum = {
            GO: "0",
            ERR1: "Senha do cartão invalida. Com mais 1 tentativa incorreta, a senha será bloqueada. Lembre-se:<br/>" +
                "  • É a senha do seu cartão de débito ou múltiplo.<br/>" +
                "  • É  a mesma senha que você usa para acessar o caixa eletrônico.<br/>" +
                "  • É diferente da sua senha eletrônica",
            ERR2: "Senha do cartão invalida. Você tem mais 2 tentativas. Lembre-se:<br/>" +
                "  • É a senha do seu cartão de débito ou múltiplo.<br/>" +
                "  • É  a mesma senha que você usa para acessar o caixa eletrônico.<br/>" +
                "  • É diferente da sua senha eletrônica.",
            ERR3: "Senha do cartão bloqueada.<br/>" +
                "Vá até a agência Itaú mais próxima e cadastre uma nova senha  do cartão.",
            ERR4: "Sua senha não está cadastrada.",
            ERR5: "Transação não confirmada. Entre em contato com o seu gerente. Mencione o código 408Y.",
            ERR6: "Erro na validação de senha."
        },
        returns = [
            { 'code': '00', 'message': 'SENHA VALIDA', 'action': actions_enum.GO },
            { 'code': '00', 'message': 'SENHA CADASTRADA COM SUCESSO', 'action': actions_enum.GO },
            { 'code': '200', 'message': 'SENHA VALIDA', 'action': actions_enum.GO },
            { 'code': '200', 'message': 'SENHA CADASTRADA COM SUCESSO', 'action': actions_enum.GO },
            { 'code': '63', 'message': 'SUSPENSA', 'action': actions_enum.ERR3 },
            { 'code': '65', 'message': 'INVALIDA', 'action': actions_enum.ERR2 },
            { 'code': '67', 'message': 'NAO CADASTRADA', 'action': actions_enum.ERR4 },
            { 'code': '67', 'message': 'NAO ESTA CADASTRADA', 'action': actions_enum.ERR4 },
            { 'code': '68', 'message': 'INVALIDA', 'action': actions_enum.ERR2 },
            { 'code': '48', 'message': 'SUA SENHA ESTA INCORRETA', 'action': actions_enum.ERR2 },
            { 'code': '76', 'message': 'INOPERANTE', 'action': actions_enum.ERR6 },
            { 'code': '89', 'message': 'TROCA DE SENHA PENDENTE', 'action': actions_enum.ERR6 },
            { 'code': '96', 'message': 'ZW060', 'action': actions_enum.ERR6 },
            { 'code': '97', 'message': 'CHIP DESATUALIZADA', 'action': actions_enum.ERR6 },
            { 'code': '98', 'message': 'PRE-SENHA PENDENTE', 'action': actions_enum.ERR6 },
            { 'code': '99', 'message': 'ERRO ACESSO AOS CADASTROS', 'action': actions_enum.ERR6 },
            { 'code': '503', 'message': 'ERRO INTERNO DO SERVIDOR', 'action': actions_enum.ERR6 },
            { 'code': '408Y', 'message': 'TRANSACAO NAO CONFIRMADA', 'action': actions_enum.ERR5 },
            { 'code': '999', 'message': 'NICA INCORRETA', 'action': actions_enum.ERR6 },
            { 'code': '443', 'message': '2A. TENTATIVA', 'action': actions_enum.ERR1 },
            { 'code': '409', 'message': 'BLOQUEADO', 'action': actions_enum.ERR3 }
        ],
        fnerror = function(data, fne) {
            try { SecUIHelper.bloqueiaNavSenha(); } catch (e) {}
            if (typeof fne === 'function') { fne(data); return; };
        },
        fnsuccess = function(data, fns) {
            if (typeof fns === 'function') { fns(data); return; };
        },
        _o = {};
    o = function() {};
    o.prototype = {
        data: function(o) {
            this._o = {};
            try { this._o.id = o.id; } catch (e) {}
            try { this._o.fns = o.success; } catch (e) {}
            try { this._o.fne = o.error; } catch (e) {}
            try { this._o.datai = o.data; } catch (e) {}
            try { this._o.url = o.url; } catch (e) {}
            return this;
        },
        valdata: function(data, fns, fne, id_el) {
            var act = null;
            try {
                try { code = data.codigo; } catch (e) {}
                try { msg = data.mensagem; } catch (e) {}
                hasMessage = typeof msg === 'string' &&  msg.length > 0;
                hasIdEl = typeof id_el === 'string' && id_el.length > 0;
                try{
                    returns.forEach(function(e, i) {
                        try {
                            if (String(code).indexOf(e.code) >= 0) {
                                act = e.action;
                                throw "ok";
                            }
                        } catch (e) {}
                        try {
                            if (hasMessage && msg.toUpperCase().trim().indexOf(e.message) >= 0) {
                                act = e.action;
                                throw "ok";
                            }
                        } catch (e) {}
                    });
                } catch (e){}
                if (act === actions_enum.GO &&
                    typeof fnsuccess === 'function') {
                    fnsuccess(data, fns);
                } else if (act != null && hasIdEl) {
                	var senhaIncorreta = "999";
                	if(senhaIncorreta != code.trim()) {
	                	var el = document.getElementById(id_el);
	                    el.className = "box-info box-info-erro";
	                    el.innerHTML = "<span class='ico ico-alerta-aviso'></span><p>" + act + "</p>";
	                    el.hidden = false;
	                    try { SecUIHelper.bloqueiaNavSenha(); } catch (e) {}
                	} else {
                		fnerror(data, fne);
                	}
                } else if (hasMessage && hasIdEl){
                	var senhaNaoPermitida = "SENHA NAO PERMITIDA";
                	if(senhaNaoPermitida != msg.toUpperCase().trim()) {
	                    var el = document.getElementById(id_el);
	                    el.className = "box-info box-info-erro";
	                    el.innerHTML = "<span class='ico ico-alerta-aviso'></span><p>" + msg + "</p>";
	                    el.hidden = false;
	                    try { SecUIHelper.bloqueiaNavSenha(); } catch (e) {}
                	} else {
                		fnerror(data, fne);
                	}
                } else {
                    fnerror(data, fne);
                }
            } catch (e) {
                fnerror(data, fne);
            }
        },
        ajaxHelper: function(options) {
            var defaultTimeOut = 150000,
                timeoutValue = function(options) {

                    if (options.timeout === undefined) {
                        return defaultTimeOut;
                    }

                    return options.timeout;
                };
            $.ajax({
                url: routerUrl,
                type: 'POST',
                data: options.data,
                cache: false,
                dataType: 'json',
                showLoading: true,
                timeout: timeoutValue(options),
                headers: {
                    op: options.url,
                    "ajaxRequest": "true",
                    "X-Auth-Token": authToken,
                    "X-CLIENT-ID": clientId,
                    "X-FLOW-ID": flowId
                }
            }).complete(function(data, textStatus, xhr) {
                try {
                    var response = JSON.parse(data.responseText);
                    if (response.ok) {
                        options.successFunction.apply(undefined, [response.object]);
                    } else {
                        options.errorFunction.apply(undefined, [response.object]);
                    }
                } catch (e) {
                    options.errorFunction.apply(undefined, [response]);
                }
                $(document).trigger('ajaxStop');
            });
        },
        test: function() {
            if (this._o === null) { return; };
            if (typeof this._o.datai === 'string') { this._o.datai = JSON.parse(this._o.datai); };
            var valData = this.valdata,
                fne = this._o.fne,
                fns = this._o.fns,
                id_el = this._o.id;
            try {
                document.getElementById(id_el).hidden = true;
            } catch (e) {}
            // verifica o preenchimento basico da senha
            if (SecUIHelper.senhaVazia() === true) {
                try { SecUIHelper.bloqueiaNavSenha(); } catch (e) {}
                return; // interrompe o fluxo pois a senha está vazia
            }
            SecUIHelper.getSC0(this._o.datai);
            this.ajaxHelper({
                url: this._o.url,
                data: this._o.datai,
                successFunction: function(data) {
                    valData(data, fns, fne, id_el);
                },
                errorFunction: function(data) {
                    fnerror(data, fne);
                }
            });
        }
    };
    return o;
})();
function customErrorBox(el){
    var errorBox = jQuery(el.currentTarget).find('.notification').first();

    if(validator.errorList.length > 0){
        // initiate vars
        var errorItems = new Array();

        // update attributes
        jQuery(errorBox).removeClass('hidden');
        
        $.each(validator.errorList, function(index, el){
            var elementID 	    = jQuery(el.element).attr('id');
            var elementLabel    = null;

            if(!jQuery(el.element).is('input[type="radio"]') && !jQuery(el.element).is('input[type="checkbox"]')){
                elementLabel = jQuery('label[for="'+elementID+'"]').first().html();
            }else{
                elementLabel = jQuery('label[for="'+elementID+'"]').parents('.form-group').first().find('p').first().html();
            }
            
            var template 	= '<li class="pointer d-inline-block w-100"><a onclick="$(\'#'+elementID+'\').focus();" href="javascript:;"><div class="left">'+elementLabel+': '+el.message+'</div></a></li>';

            errorItems.push(template);
        });
        
        // clean all li
        jQuery(errorBox).find('.notification__item').html('');

        if(errorItems.length > 0){
            // append the error descriptions
            jQuery(errorBox).find('.notification__item').first().append(errorItems);

            // update the counter
            if(errorItems.length > 1){
                jQuery(errorBox).find('.notification__title .error-count').html('Existem '+errorItems.length+' erros que precisam ser corrigidos');
            }else{
                jQuery(errorBox).find('.notification__title .error-count').html('Existe '+errorItems.length+' erro que precisa ser corrigido');
            }
        }

        // set the focus to the first element
        setTimeout(function(){
            $(errorBox).find('a').first().focus();
            
            $(errorBox).find('strong').first().attr('tabindex','-1');
            $(errorBox).find('strong').first().focus();
        }, 500);
    }else{
        // clean all li
        jQuery(errorBox).find('.notification__item').html('');

        // hide it
        // jQuery(errorBox).attr('aria-hidden', true);
        jQuery(errorBox).addClass('hidden');					
    }

    function customErrorPlacement(error, element){
        if(element.is('input[type="radio"]')){
            // add error class on input-group
            var _element = jQuery(element).parents('.input-holder').first();
            var errorId = jQuery(error).attr('id');
            _element.addClass('erro-holder');
            jQuery(_element).find('.input-holder__justify').addClass('erro-holder erro-holder__border');
            
            // get the input group itens
            var elementGroup = jQuery(_element).find('input[type="radio"]');
            // run each input adding the error arias
            jQuery.each(elementGroup, function(index, _inputElement){
                // add new error attributes
                jQuery(_inputElement).attr('aria-invalid', true);
                jQuery(_inputElement).attr('aria-describedby', errorId);
            });

            // add span with the error content
            var el = '<span class="desc desc__erro d-flex"></span>';
            jQuery(_element).append(el);
            jQuery(_element).find('.desc__erro').append(error);
        }else if(element.is('input[type="checkbox"]')){
            // add error class on input-group
            var _element = jQuery(element).parents('.input-holder').first();
            var errorId = jQuery(error).attr('id');
            _element.addClass('erro-holder');
            jQuery(_element).find('.input-holder__justify').addClass('erro-holder erro-holder__border');

            // get the input group itens
            var elementGroup = jQuery(_element).find('input[type="checkbox"]');
            // run each input adding the error arias
            jQuery.each(elementGroup, function(index, _inputElement){
                // add new error attributes
                jQuery(_inputElement).attr('aria-invalid', true);
                jQuery(_inputElement).attr('aria-describedby', errorId);
            });
            
            // add span with the error content
            var el = '<span class="desc desc__erro d-flex"></span>';
            jQuery(_element).append(el);
            jQuery(_element).find('.desc__erro').append(error);
        }else if(element.is('input[type="text"]')){
            // add error class on input-group
            var _element = jQuery(element).parents('.input-group').first();
            var errorId = jQuery(error).attr('id');

            _element.addClass('erro');

            // add new error attributes
            jQuery(element).attr('aria-invalid', true);
            jQuery(element).attr('aria-describedby', errorId);

            // add span with the error content
            var el = '<span class="desc desc__erro d-flex"></span>';
            jQuery(_element).append(el);
            jQuery(_element).find('.desc__erro').append(error);
        }else if(element.is('textarea')){
            // add error class on input-group
            var _element = jQuery(element).parents('.input-group').first();
            var errorId = jQuery(error).attr('id');
            _element.addClass('erro');

            // add new error attributes
            jQuery(element).attr('aria-invalid', true);
            jQuery(element).attr('aria-describedby', errorId);

            // add span with the error content
            var el = '<span class="desc desc__erro d-flex"></span>';
            jQuery(_element).find('.textarea-footer').prepend(el);
            jQuery(_element).find('.desc__erro').append(error);
        }else if(element.is('select')){
            // add error class on input-group
            var _element = jQuery(element).parents('.input-group').first();
            var errorId = jQuery(error).attr('id');
            _element.addClass('erro');

            // add new error attributes
            jQuery(element).attr('aria-invalid', true);
            jQuery(element).attr('aria-describedby', errorId);

            // add span with the error content
            var el = '<span class="desc desc__erro d-flex"></span>';
            jQuery(_element).append(el);
            jQuery(_element).find('.desc__erro').append(error);
        }else{
            return false;
        }
    }
    function customSuccessRemove(label, element){
        if(jQuery(element).is('input[type="radio"]')){
            // remove error class on input-group
            var _element = jQuery(element).parents('.input-holder').first();
            _element.removeClass('erro-holder');
            jQuery(_element).find('.input-holder__justify').removeClass('erro-holder erro-holder__border');
            
            // get the input group itens
            var elementGroup = jQuery(_element).find('input[type="radio"]');
            // run each input adding the error arias
            jQuery.each(elementGroup, function(index, _inputElement){
                // add new error attributes
                jQuery(_inputElement).removeAttr('aria-invalid');
                jQuery(_inputElement).removeAttr('aria-describedby');
            });

            // remove span with the error content
            jQuery(_element).find('.desc__erro').remove();
        }else if(jQuery(element).is('input[type="checkbox"]')){
            // remove error class on input-group
            var _element = jQuery(element).parents('.input-holder').first();
            _element.removeClass('erro-holder');
            jQuery(_element).find('.input-holder__justify').removeClass('erro-holder erro-holder__border');

            // get the input group itens
            var elementGroup = jQuery(_element).find('input[type="checkbox"]');
            // run each input adding the error arias
            jQuery.each(elementGroup, function(index, _inputElement){
                // add new error attributes
                jQuery(_inputElement).removeAttr('aria-invalid');
                jQuery(_inputElement).removeAttr('aria-describedby');
            });

            // remove span with the error content
            jQuery(_element).find('.desc__erro').remove();
        }else if(jQuery(element).is('input[type="text"]')){
            // remove error class on input-group
            var _element = jQuery(element).parents('.input-group').first();
            _element.removeClass('erro');

            // add new error attributes
            jQuery(element).removeAttr('aria-invalid');
            jQuery(element).removeAttr('aria-describedby');

            // remove span with the error content
            jQuery(_element).find('.desc__erro').remove();
        }else if(jQuery(element).is('textarea')){
            // remove error class on input-group
            var _element = jQuery(element).parents('.input-group').first();
            _element.removeClass('erro');

            // add new error attributes
            jQuery(element).removeAttr('aria-invalid');
            jQuery(element).removeAttr('aria-describedby');

            // remove span with the error content
            jQuery(_element).find('.desc__erro').remove();
        }else if(jQuery(element).is('select')){
            // remove error class on input-group
            var _element = jQuery(element).parents('.input-group').first();
            _element.removeClass('erro');

            // add new error attributes
            jQuery(element).removeAttr('aria-invalid');
            jQuery(element).removeAttr('aria-describedby');

            // remove span with the error content
            jQuery(_element).find('.desc__erro').remove();
        }else{
            return false;
        }
    }
    jQuery(document).on('click', '[data-hide-box]', function(ev){
        var element = jQuery(this).attr('data-hide-box');
        if(element.length > 0){
            var parent = jQuery(this).parents('.'+element).first();
            jQuery(parent).addClass('hidden');
            
            // set the focus to the first form input
            jQuery(this).parents('form').first().find('input').first().focus();
        }
    });
}


function customErrorPlacement(error, element){
    if(element.is('input[type="radio"]')){
        // add error class on input-group
        var _element = jQuery(element).parents('.input-holder').first();
        var errorId = jQuery(error).attr('id');
        _element.addClass('erro-holder');
        jQuery(_element).find('.input-holder__justify').addClass('erro-holder erro-holder__border');
        
        // get the input group itens
        var elementGroup = jQuery(_element).find('input[type="radio"]');
        // run each input adding the error arias
        jQuery.each(elementGroup, function(index, _inputElement){
            // add new error attributes
            jQuery(_inputElement).attr('aria-invalid', true);
            jQuery(_inputElement).attr('aria-describedby', errorId);
        });

        // add span with the error content
        var el = '<span class="desc desc__erro d-flex"></span>';
        jQuery(_element).append(el);
        jQuery(_element).find('.desc__erro').append(error);
    }else if(element.is('input[type="checkbox"]')){
        // add error class on input-group
        var _element = jQuery(element).parents('.input-holder').first();
        var errorId = jQuery(error).attr('id');
        _element.addClass('erro-holder');
        jQuery(_element).find('.input-holder__justify').addClass('erro-holder erro-holder__border');

        // get the input group itens
        var elementGroup = jQuery(_element).find('input[type="checkbox"]');
        // run each input adding the error arias
        jQuery.each(elementGroup, function(index, _inputElement){
            // add new error attributes
            jQuery(_inputElement).attr('aria-invalid', true);
            jQuery(_inputElement).attr('aria-describedby', errorId);
        });
        
        // add span with the error content
        var el = '<span class="desc desc__erro d-flex"></span>';
        jQuery(_element).append(el);
        jQuery(_element).find('.desc__erro').append(error);
    }else if(element.is('input[type="text"]')){
        // add error class on input-group
        var _element = jQuery(element).parents('.input-group').first();
        var errorId = jQuery(error).attr('id');

        _element.addClass('erro');

        // add new error attributes
        jQuery(element).attr('aria-invalid', true);
        jQuery(element).attr('aria-describedby', errorId);

        // add span with the error content
        var el = '<span class="desc desc__erro d-flex"></span>';
        jQuery(_element).append(el);
        jQuery(_element).find('.desc__erro').append(error);
    }else if(element.is('textarea')){
        // add error class on input-group
        var _element = jQuery(element).parents('.input-group').first();
        var errorId = jQuery(error).attr('id');
        _element.addClass('erro');

        // add new error attributes
        jQuery(element).attr('aria-invalid', true);
        jQuery(element).attr('aria-describedby', errorId);

        // add span with the error content
        var el = '<span class="desc desc__erro d-flex"></span>';
        jQuery(_element).find('.textarea-footer').prepend(el);
        jQuery(_element).find('.desc__erro').append(error);
    }else if(element.is('select')){
        // add error class on input-group
        var _element = jQuery(element).parents('.input-group').first();
        var errorId = jQuery(error).attr('id');
        _element.addClass('erro');

        // add new error attributes
        jQuery(element).attr('aria-invalid', true);
        jQuery(element).attr('aria-describedby', errorId);

        // add span with the error content
        var el = '<span class="desc desc__erro d-flex"></span>';
        jQuery(_element).append(el);
        jQuery(_element).find('.desc__erro').append(error);
    }else{
        return false;
    }
}

function customSuccessRemove(label, element){
    if(jQuery(element).is('input[type="radio"]')){
        // remove error class on input-group
        var _element = jQuery(element).parents('.input-holder').first();
        _element.removeClass('erro-holder');
        jQuery(_element).find('.input-holder__justify').removeClass('erro-holder erro-holder__border');
        
        // get the input group itens
        var elementGroup = jQuery(_element).find('input[type="radio"]');
        // run each input adding the error arias
        jQuery.each(elementGroup, function(index, _inputElement){
            // add new error attributes
            jQuery(_inputElement).removeAttr('aria-invalid');
            jQuery(_inputElement).removeAttr('aria-describedby');
        });

        // remove span with the error content
        jQuery(_element).find('.desc__erro').remove();
    }else if(jQuery(element).is('input[type="checkbox"]')){
        // remove error class on input-group
        var _element = jQuery(element).parents('.input-holder').first();
        _element.removeClass('erro-holder');
        jQuery(_element).find('.input-holder__justify').removeClass('erro-holder erro-holder__border');

        // get the input group itens
        var elementGroup = jQuery(_element).find('input[type="checkbox"]');
        // run each input adding the error arias
        jQuery.each(elementGroup, function(index, _inputElement){
            // add new error attributes
            jQuery(_inputElement).removeAttr('aria-invalid');
            jQuery(_inputElement).removeAttr('aria-describedby');
        });

        // remove span with the error content
        jQuery(_element).find('.desc__erro').remove();
    }else if(jQuery(element).is('input[type="text"]')){
        // remove error class on input-group
        var _element = jQuery(element).parents('.input-group').first();
        _element.removeClass('erro');

        // add new error attributes
        jQuery(element).removeAttr('aria-invalid');
        jQuery(element).removeAttr('aria-describedby');

        // remove span with the error content
        jQuery(_element).find('.desc__erro').remove();
    }else if(jQuery(element).is('textarea')){
        // remove error class on input-group
        var _element = jQuery(element).parents('.input-group').first();
        _element.removeClass('erro');

        // add new error attributes
        jQuery(element).removeAttr('aria-invalid');
        jQuery(element).removeAttr('aria-describedby');

        // remove span with the error content
        jQuery(_element).find('.desc__erro').remove();
    }else if(jQuery(element).is('select')){
        // remove error class on input-group
        var _element = jQuery(element).parents('.input-group').first();
        _element.removeClass('erro');

        // add new error attributes
        jQuery(element).removeAttr('aria-invalid');
        jQuery(element).removeAttr('aria-describedby');

        // remove span with the error content
        jQuery(_element).find('.desc__erro').remove();
    }else{
        return false;
    }
}

function customMask(){
    var dateMasks 			= document.getElementsByClassName('date-mask');
    var dayMasks 			= document.getElementsByClassName('day-mask');
    var monthMasks 			= document.getElementsByClassName('month-mask');
    var yearMasks 			= document.getElementsByClassName('year-mask');
    var timeMasks 			= document.getElementsByClassName('time-mask');
    var datetimeMasks 		= document.getElementsByClassName('datetime-mask');
    var cpfMasks 			= document.getElementsByClassName('cpf-mask');
    var cnpjMasks 			= document.getElementsByClassName('cnpj-mask');
    var cpfCnpjMasks 		= document.getElementsByClassName('cpf-cnpj-mask');
    var rgMasks 			= document.getElementsByClassName('rg-mask');
    var telMasks 			= document.getElementsByClassName('tel-mask');
    var telSimpleMasks 		= document.getElementsByClassName('tel-simple-mask');
    var momentYearFormat 	= 'YYYY';
    var momentDateFormat 	= 'DD/MM/YYYY';
    var momentFullFormat 	= 'DD/MM/YYYY HH:mm:ss';
    var momentHourFormat 	= 'HH:mm:ss';
    // set the masks
    // date
    Array.prototype.forEach.call(dateMasks, function(element){
        new IMask(
            element,
            {
                mask: Date,
                pattern: momentDateFormat,
                min: new Date(1500, 0, 1),
                max: new Date(2099, 0, 1),
                lazy: false,
                format: function (date) {
                    return moment(date).format(momentDateFormat);
                },
                parse: function (str) {
                    return moment(str, momentDateFormat);
                },
                blocks: {
                    DD: {
                        mask: IMask.MaskedRange,
                        from: 1,
                        to: 31
                    },
                    MM: {
                        mask: IMask.MaskedRange,
                        from: 1,
                        to: 12
                    },
                    YYYY: {
                        mask: IMask.MaskedRange,
                        from: 1500,
                        to: 2099
                    }
                }
            }
        );
    });
    // day
    Array.prototype.forEach.call(dayMasks, function(element){
        new IMask(
            element,
            {
                mask: /^0*([1-9]|[12][0-9]|3[01])$/,
                lazy: false
            }
        );
    });
    // month
    Array.prototype.forEach.call(monthMasks, function(element){
        new IMask(
            element,
            {
                mask: /^0*([1-9]|1[0-2])$/,
                lazy: false
            }
        );
    });
    // year
    Array.prototype.forEach.call(yearMasks, function(element){
        new IMask(
            element,
            {
                mask: Date,
                pattern: momentYearFormat,
                lazy: false,
                min: new Date(1500, 0, 1),
                max: new Date(2099, 0, 1),

                format: function (date) {
                    return moment(date).format(momentYearFormat);
                },
                parse: function (str) {
                    return moment(str, momentYearFormat);
                },

                blocks: {
                    YYYY: {
                        mask: IMask.MaskedRange,
                        from: 1500,
                        to: 2099
                    }
                }
            }
        );
    });
    // time
    Array.prototype.forEach.call(timeMasks, function(element){
        new IMask(
            element,
            {
                mask: Date,
                pattern: momentHourFormat,
                lazy: false,
                min: new Date(1500, 0, 1),
                max: new Date(2099, 0, 1),

                format: function (date) {
                    return moment(date).format(momentHourFormat);
                },
                parse: function (str) {
                    return moment(str, momentHourFormat);
                },

                blocks: {
                    HH: {
                        mask: IMask.MaskedRange,
                        from: 0,
                        to: 23
                    },
                    mm: {
                        mask: IMask.MaskedRange,
                        from: 0,
                        to: 59
                    },
                    ss: {
                        mask: IMask.MaskedRange,
                        from: 0,
                        to: 59
                    }
                }
            }
        );
    });
    // datetime
    Array.prototype.forEach.call(datetimeMasks, function(element){
        new IMask(
            element,
            {
                mask: Date,
                pattern: momentFullFormat,
                lazy: false,
                min: new Date(1500, 0, 1),
                max: new Date(2099, 0, 1),

                format: function (date) {
                    return moment(date).format(momentFullFormat);
                },
                parse: function (str) {
                    return moment(str, momentFullFormat);
                },

                blocks: {
                    DD: {
                        mask: IMask.MaskedRange,
                        from: 1,
                        to: 31
                    },
                    MM: {
                        mask: IMask.MaskedRange,
                        from: 1,
                        to: 12
                    },
                    YYYY: {
                        mask: IMask.MaskedRange,
                        from: 1500,
                        to: 2099
                    },
                    HH: {
                        mask: IMask.MaskedRange,
                        from: 0,
                        to: 23
                    },
                    mm: {
                        mask: IMask.MaskedRange,
                        from: 0,
                        to: 59
                    },
                    ss: {
                        mask: IMask.MaskedRange,
                        from: 0,
                        to: 59
                    }
                }
            }
        );
    });
    // cpf
    Array.prototype.forEach.call(cpfMasks, function(element){
        var test = new IMask(
            element,
            {
                mask: '000.000.000-00',
                lazy: false
            }
        );

        test.on("complete", function () {console.log(test.value)});

    });
    // cnpj
    Array.prototype.forEach.call(cnpjMasks, function(element){
        new IMask(
            element,
            {
                mask: '00.000.000/0000-00',
                lazy: false
            }
        );
    });
    // cpf/cnpj
    Array.prototype.forEach.call(cpfCnpjMasks, function(element){
        new IMask(
            element,
            {
                mask: [
                    {
                        mask: '000.000.000-00'
                    },
                    {
                        mask: '00.000.000/0000-00'
                    }
                ],
            }
        );
    });
    // rg
    Array.prototype.forEach.call(rgMasks, function(element){
        new IMask(
            element,
            {
                mask: '00.000.000-*',
                lazy: false
            }
        );
    });
    // tel
    Array.prototype.forEach.call(telMasks, function(element){
        new IMask(
            element,
            {
                mask: '(00) [0]0000-0000',
                lazy: true
            }
        );
    });
    // tel simple
    Array.prototype.forEach.call(telSimpleMasks, function(element){
        new IMask(
            element,
            {
                mask: '[0]0000-0000',
                lazy: true
            }
        );
    });
}
function gerarCSV(headers, linhas, nomeArquivo) {
  template = headers.join(";");
  linhas.forEach(function(linha) {
    template += "\n" + linha.join(";");
  });
  const valor = btoa(template);
  var blob = new Blob(["\ufeff", template]);
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, nomeArquivo + ".csv");
  } else {
    const link = document.createElement("A");
    link.href = "data:application/csv;base64, " + valor;
    link.download = nomeArquivo + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function gerarTXT(headers, linhas, nomeArquivo) {
  var template = "";
  const espacos = "                                                                           ";
  headers.forEach(function(header) {
    // Limitando o tamanho da coluna para 74 caracteres + 1 de espaco
    if (header.tamanho > 74) {
      header.tamanho = 74;
    }
    var campoHeader =
      header.titulo.length > header.tamanho
        ? header.titulo.substring(0, header.tamanho)
        : header.titulo;
    template +=
      campoHeader +
      espacos.substring(0, header.tamanho - campoHeader.length + 1);
  });

  linhas.forEach(function(linha) {
    var index = 0;
    template += "\r\n";
    linha.forEach(function(campo) {
      var campoTela = campo.length > headers[index].tamanho ? campo.substring(0, headers[index].tamanho) : campo;
      template += campoTela + espacos.substring(0, headers[index].tamanho - campoTela.length + 1);
      index++;
    });
  });
  var blob = new Blob(["\ufeff", template]);
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, nomeArquivo + ".txt");
  } else {
    const link = document.createElement("A");
    link.href = "data:text/txt;charset=utf-8," + template;
    link.download = nomeArquivo + ".txt";
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * AsyncHelper
 * 
 * Criado pela Sala de Vendas PJ em março de 2020.
 * 
 * :: ifGlobal ::
 * Permite acessar variáveis do escopo global que não necessariamente
 * estarão definidas imediatamente após o carregamento do bankline.
 * A utilização do bloco 'else' é opcional.
 * Exemplos de uso:
 * 
    AsyncHelper.ifGlobal("_campaign")
        .then(function(_campaign){ ... })
        .else(function(){ ... })

    ** ou simplesmente **

    AsyncHelper.ifGlobal("_campaign")
        .then(function(_campaign){ ... })

 * :: ifCampaign ::
 * Condiciona a execução de um bloco de código à presença de uma campanha (Warning HI).
 * A utilização do bloco 'else' é opcional.
 * Exemplos de uso:

    AsyncHelper.ifCampaign('CODIGO-DA-CAMPANHA')
        .then(function(campanha){ ... })
        .else(function(){ ... })

    ** ou simplesmente **

    AsyncHelper.ifCampaign('CODIGO-DA-CAMPANHA')
        .then(function(campanha){ ... })

 * :: importJS ::
 * Importa assíncronamente um arquivo javascript.
 * AsyncHelper.importJs('https://...').then(function(){ ... })

* :: Logs ::
* Para habilitar ou desabilitar logs:
* AsyncHelper.enableLog()
* AsyncHelper.disableLog()

@author Alexandre Paravela
@author Breno Cupertino
@author Caio Santos
 */

(function () {
    var isLogEnabled = false;
    var enableLog = function () { isLogEnabled = true; }
    var disableLog = function () { isLogEnabled = false; }
    var log = function () {
        isLogEnabled && console.log.apply(null, arguments);
    }
    var ifGlobal = function (globalScopeVariableName) {
        log("[ifGlobal ( " + globalScopeVariableName + " )]");
        var isJobDone = false;
        var attempts = 10;
        var interval = 3;
        var thenCallback = null;
        var elseCallback = null;
        var response = {
            then: function (cb) { thenCallback = cb; return response; },
            else: function (cb) { elseCallback = cb; }
        };
        var timerFunction = function () {
            if (isJobDone) return;
            if (attempts <= 0) {
                log("[ifGlobal ( " + globalScopeVariableName + " )] calling else");
                isJobDone = true;
                clearTimeout(instantTimer);
                clearInterval(timer);
                typeof elseCallback === 'function' && elseCallback();
                return;
            }
            log("[ifGlobal ( " + globalScopeVariableName + " )] waiting " + attempts);
            attempts--;
            if (!!window[globalScopeVariableName]) {
                isJobDone = true;
                clearTimeout(instantTimer);
                clearInterval(timer);
                log("[ifGlobal ( " + globalScopeVariableName + " )] calling then");
                typeof thenCallback === 'function' && thenCallback(window[globalScopeVariableName]);
                return;
            }
        }
        var instantTimer = setTimeout(timerFunction, 0);
        var timer = setInterval(timerFunction, interval * 1000);
        return response;
    }
    var ifInLocalStorage = function (localStorageKey) {
        log("[ifInLocalStorage ( " + localStorageKey + " )]");
        var isJobDone = false;
        var attempts = 10;
        var interval = 3;
        var thenCallback = null;
        var elseCallback = null;
        var response = {
            then: function (cb) { thenCallback = cb; return response; },
            else: function (cb) { elseCallback = cb; }
        };
        var timerFunction = function () {
            if (isJobDone) return;
            if (attempts <= 0) {
                log("[ifInLocalStorage ( " + localStorageKey + " )] calling else");
                isJobDone = true;
                clearTimeout(instantTimer);
                clearInterval(timer);
                typeof elseCallback === 'function' && elseCallback();
                return;
            }
            log("[ifInLocalStorage ( " + localStorageKey + " )] waiting " + attempts);
            attempts--;
            if (!!localStorage.getItem(localStorageKey)) {
                isJobDone = true;
                clearTimeout(instantTimer);
                clearInterval(timer);
                log("[ifInLocalStorage ( " + localStorageKey + " )] calling then");
                typeof thenCallback === 'function' && thenCallback(localStorage.getItem(localStorageKey));
                return;
            }
        }
        var instantTimer = setTimeout(timerFunction, 0);
        var timer = setInterval(timerFunction, interval * 1000);
        return response;
    }
    var ifCampaign = function (campaignId) {
        log('[ifCampaign ( ' + campaignId + ' )]');
        var thenCallback = null;
        var elseCallback = null;
        var response = {
            then: function (cb) { thenCallback = cb; return response; },
            else: function (cb) { elseCallback = cb; }
        }
        ifGlobal("_campaign")
            .then(function (_campaign) {
                var campaignFound = _campaign.campanha && _campaign.campanha.filter(function (campanha) { return campanha.idWarning === campaignId })[0]
                if (!!campaignFound) {
                    log('[ifCampaign ( ' + campaignId + ' )] calling then');
                    return typeof thenCallback === 'function' && thenCallback(campaignFound);
                } else {
                    log('[ifCampaign ( ' + campaignId + ' )] calling else, ' + campaignId + ' is not in the campaign list');
                    return typeof elseCallback === 'function' && elseCallback();
                }
            }).else(function () {
                log('[ifCampaign ( ' + campaignId + ' )] calling else, _campaign is not in the global scope');
                return typeof elseCallback === 'function' && elseCallback();
            })
        return response;
    }
    var importJs = function (src) {
        var onLoad = null;
        var response = { then: function (cb) { onLoad = cb; } }
        var script = document.createElement('script');
        script.onload = function () { typeof onLoad === 'function' && onLoad(); };
        script.src = src;
        document.getElementsByTagName('head')[0].appendChild(script);
        return response;
    }
    window.AsyncHelper = window.AsyncHelper || {
        enableLog: enableLog,
        disableLog: disableLog,
        ifGlobal: ifGlobal,
        ifInLocalStorage: ifInLocalStorage,
        ifCampaign: ifCampaign,
        importJs: importJs
    };
})();

/**
 * Este script foi desenvolvido para adicionar pontualmente um ícone (bolinha)
 * de notificacao ao menu de crédito e ao sub-menu "ir para pagina de crédito" no site PJ
 * para uma ação da sala de vendas
 * 
    @author Alexandre Paravela
    @author Breno Cupertino
    @author Caio Santos
 */
(function () {

    $(document).ready(function () {

        AsyncHelper
            .ifInLocalStorage("pointNotificationCampaignCode")
            .then(function (campaignCode) {

                AsyncHelper
                    .ifCampaign(campaignCode)
                    .then(function () {

                        var TEXTO_MENU = "crédito";
                        var TEXTO_MENU_ALT = "Crédito e Financiamento";
                        var TEXTO_SUBMENU = "ir para a página de crédito";
                        var BOLINHA_MENU = '<span style="color: #ec7000; font-size: 80px; margin-top: -10px; margin-left: -3px; padding: 0; float: right; line-height: 0; position: absolute;">.</span>';
                        var BOLINHA_SUBMENU = '<span style="color: #ec7000; position: absolute; font-size: 80px; top: -15px; right: 49px;">.</span>';
                        if (!!window.MSInputMethodContext && !!document.documentMode) { //IE11 
                            BOLINHA_MENU = '<span style="color: #ec7000; font-size: 80px; margin-top: -20px; margin-left: -3px; padding: 0; float: right; line-height: 0; position: absolute;">.</span>';
                            BOLINHA_SUBMENU = '<span style="color: #ec7000; position: absolute; font-size: 80px; top: -25px; right: 49px;">.</span>';
                        } 

                        $("#main-menu > li > a")
                            .filter(function () {
                                return $(this).text().trim() == TEXTO_MENU ||
                                    $(this).text().trim() == TEXTO_MENU_ALT;
                            })
                            .append(BOLINHA_MENU);
                        $(".submenu-item-ni > a")
                            .filter(function () {
                                return $(this).text().trim() == TEXTO_SUBMENU;
                            })
                            .parent()
                            .css('position', 'relative')
                            .append(BOLINHA_SUBMENU);
                    });
            });
    });
})();
