function voltar() {
	if($(".mfp-bg.mfp-ready").size() > 0){
		BackInterceptor.backDiv($("div[class='modulo modulo-lightbox']").attr("id"));
	}else{
		BackInterceptor.back();
	}
}

var BackInterceptor={
	versao:'1.0.0',
	descricao:'Interceptor de eventos do botão voltar do Navegador',
	browser:{
			IE:!!(window.attachEvent&&!window.opera),
			Safari:navigator.userAgent.indexOf('Apple')>-1,
			Opera:!!window.opera
		},
	onBack:function(){
		voltar();
		setTimeout("BackInterceptor.inicializar();",100);
		},
	hash:'false',
	alterarHash:function(){
			if(BackInterceptor.hash=='false'){
				if(window.location.hash=='#30horas'){
					BackInterceptor.hash='true';
				}else{
					window.location.hash='#30horas';
				}
				setTimeout("BackInterceptor.alterarHash();",100);
				
			}else if(BackInterceptor.hash=='true'){
				if(window.location.hash==''){
					BackInterceptor.hash='false';
					BackInterceptor.onBack();
				}else{
					setTimeout("BackInterceptor.alterarHash();",100);
				}
			}
	},
	back:function(){
		$.event.trigger({type: "conteudo:carregando"});

		$.ajax({
			data : {"backFlag" : true, "lightBox": false},
			type : 'POST',
			contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
			cache: false,
			timeout: 150000,
			headers: {
				"back" : true,
				"op" : backOp,
				"ajaxRequest" : false,
				"X-Auth-Token" : authToken,
				"X-CLIENT-ID" : clientId,
				"X-FLOW-ID" : flowId,
				"segmento" : segmento
			}
		}).done(function(response, textStatus, xhr) {
			setAuthToken(xhr.getResponseHeader("X-Auth-Token"));
			setClientId(xhr.getResponseHeader("X-CLIENT-ID"));
			setFlowId(xhr.getResponseHeader("X-FLOW-ID"));
			setSegmento(xhr.getResponseHeader("segmento"));

			if (response.indexOf("id=\"content\"") != -1) {
				var routerUI = new RouterUi();
				routerUI.renderPage(response);
				$(document).ready(BackInterceptor.readyCallBack());
			}

			else {
				$("#content").html(response);
				$.event.trigger({type: "conteudo:carregado"});
				$(document).ready(BackInterceptor.readyCallBack());
			}
		});
	},
	backDiv:function(id){
		$.event.trigger({type: "conteudo:carregando"});

		$.ajax({
			data : {"backFlag" : true, "lightBox": true},
			type : 'POST',
			contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
			cache: false,
			timeout: 150000,
			headers: {
				"op" : backOp,
				"ajaxRequest" : true,
				"X-Auth-Token" : authToken,
				"X-CLIENT-ID" : clientId,
				"X-FLOW-ID" : flowId,
				"segmento" : segmento
			}
		}).done(function(response, textStatus, xhr) {
			setAuthToken(xhr.getResponseHeader("X-Auth-Token"));
			setClientId(xhr.getResponseHeader("X-CLIENT-ID"));
			setFlowId(xhr.getResponseHeader("X-FLOW-ID"));
			setSegmento(xhr.getResponseHeader("segmento"));
			
			$("#"+id).html(response);
			$.magnificPopup.open({items : [ {type : 'inline',src : '#'+id} ]});
			$.event.trigger({type: "conteudo:carregado"});
			$(document).ready(BackInterceptor.readyCallBack());
		});
	},
	inicializar:function(){
		
		if(window.location.hash == '#30horas'){
			return;
		}
		
		window.location.hash='';
		setTimeout("BackInterceptor.alterarHash();",600);
	},
	readyCallBack:function() {
		uiConfiguration.configure();
	}
	};
	BackInterceptor.inicializar();
	
﻿/**
 * Helper para requisições ajax nas apps
 * 
 * 
 * Uso:
 * 
 * $.executeRequest(options);
 * 
 * @author Deivid Martins
 * 
 * 
 * @param $
 */

(function($) {
	
	
	$.fn.ajaxHelper = function() {

	};
	
	$.ajaxHelper = {};
	
	$.ajaxHelper.executeRequest = function (options) {

		var defaultTimeOut = 150000, 
			timeoutValue = function (options) {
				
				if(options.timeout === undefined) {
					return defaultTimeOut;
				}

				return options.timeout;
			};
		$.ajax({
			url: '/router-app/router',
			type: 'POST',
			data: options.data,
			contentType: "application/json; charset=utf-8",
			cache: false,
			dataType: 'json',
			showLoading: options.showLoading,
			timeout: timeoutValue(options),
			headers: {
			    op : options.url,
			    "ajaxRequest": "true",
			    "X-Auth-Token" : authToken,
				"X-CLIENT-ID" : clientId,
				"X-FLOW-ID" : flowId,
				"segmento" : segmento
			}
			
		}).done(function(data, textStatus, xhr) {
			setAuthToken(xhr.getResponseHeader("X-Auth-Token"));
			setClientId(xhr.getResponseHeader("X-CLIENT-ID"));
			setFlowId(xhr.getResponseHeader("X-FLOW-ID"));
			setSegmento(xhr.getResponseHeader("segmento"));

			if(data.ok) {

				options.successFunction.apply(undefined, [data.object]);
			}
			else{
				options.errorFunction.apply(undefined, [data.object]);
			}
		});
	};

}(jQuery));

﻿/*!
 * router.js - Bankline request router
 *
 * Version:  2.1.0
 * Author: Danilo Gomes, Deivid Martins, Sergio Lopes and Joao Paulo Cardozo, Ayrton Saito
 *
 * Copyright (c) 2014-2017 Itaú Unibanco
 *
 * DO NOT DISTRIBUTE WITHOUT PERMISSION
 */

var routerUrl = '/router-app/router';
var staticContentUrl = '/conteudo-gerenciado/arquivos';
var router = new Router();

(function(window) {

	var imgLoading = "data:image/gif;base64,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";
	var imgLoadingMini = "data:image/gif;base64,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";
	
	/* Define loadPage em escopo global, dentro do objeto window*/
	window.loadPage = router.loadPage;

	$(window).ready(function() {

		$(document).on('click', 'a', function(event) {
			handleButtonsEvents($(this), event);
		});

		$(document).on('click', 'input[type=button]', function(event) {
			handleButtonsEvents($(this), event);
		});

		var handleButtonsEvents = function(element, event) {
			var op = element.data("op"),
				type = $(element).data("type"),
        		renderElementId = $(element).data("render-element-id"),
				loadingType = $(element).data("loading-type"),
				preloadFunction = $(element).data("preload-function"),
				callbackFunction = $(element).data("callback-function");

			if (op != null && (type == null || type === 'self')) {
				event.preventDefault();
				//chamada function do loading
				setLoading(renderElementId, loadingType, preloadFunction);
				router.performRequest(op, renderElementId, callbackFunction);
				return false;
			}

			if (type === "download") {
				event.preventDefault();
				setLoading(renderElementId, loadingType, preloadFunction);
				router.performRequestDownload(op);
				return false;
			}
		};

		$(document).on('submit', 'form', function(event) {
			
			var data = $(this).serialize(),
				dataArray = $(this).serializeArray(),
				type = $(this).data("type"),
        		renderElementId = $(this).data("render-element-id"),
				loadingType = $(this).data("loading-type"),
				preloadFunction = $(this).data("preload-function"),
				callbackFunction = $(this).data("callback-function");

			var op, metodo;	

			if ($(this).find("#op").length == 0) {
				op = $(this).find("[data-op]").attr("data-op");
				metodo = $(this).find("[data-op]").attr("name");
			} else 	{
				op = $(this).find("#op").val();
				metodo = $(this).find("#op").attr("name");
			}


			if ($(this).attr('id') === 'formDownloadIE9') {
				return true;
			}

			event.preventDefault();

			if (type === "download") {
				//chamada function do loading
				setLoading(renderElementId, loadingType, preloadFunction, data);
				router.performRequestDownload(op, data, dataArray);
				return false;
			}

			switch (metodo) {
			case "opFull":
				router.performRequestComplete(op, data);
				break;

			case "opPopup":
				var name = $(this).find("#janela").val(),
					parametros = $(this).find("#parametros").val();

				setLoading(renderElementId, loadingType, preloadFunction, data);
				router.performRequestPopup(op, data, name, parametros);
				break;

			default:
				setLoading(renderElementId, loadingType, preloadFunction, data);
				router.performRequest(op, renderElementId, callbackFunction, data);

			}

			return false;
		});



		$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
			var dataType = "";
			if (options.dataType) {
				dataType = options.dataType;
			}

			if (options.url.indexOf(routerUrl) == -1 && dataType !== "script" && options.url.indexOf(staticContentUrl) == -1) {
				var op = options.url;
				options.url = routerUrl;
				jqXHR.setRequestHeader('op', op);
			}

			if (options.headers === undefined || options.headers["X-Auth-Token"] === undefined) {
				jqXHR.setRequestHeader('X-Auth-Token', authToken);
			}
			if (!Cookies.get("X-AUTH-TOKEN") || Cookies.get("X-AUTH-TOKEN") !== authToken) {
				Cookies.set("X-AUTH-TOKEN", authToken, { path: "/" });
			}

			if (options.headers === undefined || options.headers["X-CLIENT-ID"] === undefined) {
				jqXHR.setRequestHeader('X-CLIENT-ID', clientId);
			}

			if (options.headers === undefined || options.headers["X-FLOW-ID"] === undefined) {
				jqXHR.setRequestHeader('X-FLOW-ID', flowId);
			}

			if (options.headers === undefined || options.headers["segmento"] === undefined) {
				jqXHR.setRequestHeader('segmento', segmento);
			}

			

			if (dataType === "script"
		     	&& (options.url.indexOf("/all.js") != -1 || options.url.indexOf("js-router.js") != -1)
		     	&& isLegacyIE()) {
		     	// IE8 estava carregando mesmo scripts varias vezes
		    	jqXHR.abort();

		    }
		});

		$.maxZIndex = $.fn.maxZIndex = function(opt) {
		    /// <summary>
		    /// Retorna o maior zOrder na pagina (sem parametro)
		    /// Define o maior zOrder passando um valor diferente de zero
		    /// que adiciona para o maior valor zOrder
		    /// </summary>
		    /// <param name="opt" type="object">
		    /// inc: incrementa valor,
		    /// group: seletor para filtrar os elementos para calculo do maior zIndex
			///        por padrao considera todos os elementos da pagina
		    /// </param>
		    /// <returns type="jQuery" />
		    var def = { inc: 10, group: "*" };
		    $.extend(def, opt);
		    var zmax = 0;
		    $(def.group).each(function() {
		        var cur = parseInt($(this).css('z-index'));
		        zmax = cur > zmax ? cur : zmax;
		    });
		    if (!this.jquery)
		        return zmax;

		    return this.each(function() {
		        zmax += def.inc;
		        $(this).css("z-index", zmax);
		    });
		}

		var showLoadingLightBox = function() {
			try {
				var maxZIndex = $.maxZIndex() + 5;
			    $.blockUI({
			    	message: '<div class="row clearfix"><img src="'+imgLoading+'" alt="Carregando"><br/><h3 class="txt-destaque">Carregando...<h3></div>',
			    	baseZ: maxZIndex,
			    	overlayCSS: { backgroundColor: '#fff' , opacity: 0.9 },
					 css: {
						padding:        0,
						margin:         0,
						width:          '30%',
						top:            '40%',
						left:           '35%',
						textAlign:      'center',
						color:          '#000',
						border:         '',
						backgroundColor:'#fff',
						cursor:         ''
					}
			    } );
		    }
		    catch(e) {
		    	try {
		    		console.log(e);
		    	}
		    	catch(exception) {

		    	}
		    }
		};

		var closeLoadingLightBox = function() {
			try {
				$.unblockUI();
			}
			catch(e) {
		    	try {
		    		console.log(e);
		    	}
		    	catch(exception) {

		    	}
		    }
		};

		// o padrão é mostrar o loading
		var mustShowLoading = function(options) {
			return options.showLoading === undefined || options.showLoading == true;
		};

		$(document).ajaxSend( function(event, jqxhr, options) {
			if (mustShowLoading(options)) {
				if (options.headers !== undefined && typeof options.headers["render-element-id"] !== 'undefined'){
					var elemento = options.headers["render-element-id"],
						target;
						
					if ($('#'+elemento).hasClass("modulo")){
						target = $('#'+elemento);
					} else {
						target = $('#'+elemento).find(".modulo");
					}

					var conteudo = "<div id='divGif' class='row center clearfix '><img src='"+imgLoading+"' class='center' alt='Carregando' /></div>";
					target.append(conteudo);
					$.event.trigger({type: "loader:iniciado"});
				}

				if (!$("#divGif").length){
					showLoadingLightBox();
					$.event.trigger({type: "loader:iniciado"});
				}
			}
		});

		$(document).ajaxStop(function( event, xhr, options) {
			if ($("#divGif").length){
				$("#divGif" ).hide();
				$("#divGif" ).remove();
			} else {
				closeLoadingLightBox();
			}
			$.event.trigger({type: "loader:finalizado"});
		});


		//function setar loading e executar function preload
		var setLoading = function(renderElementId, loadingType, preloadFunction, data) {
		
			var transformaSerializedFormEmObject = function(data) {
				if(data === undefined ||  (!data || /^\s*$/.test(data)) || data.indexOf("=") == -1) {
					return "";
				}
				
				return JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
			};
			
			//executanto function preload
			executeFunctionByName(preloadFunction, transformaSerializedFormEmObject(data));

			//aplicando loading
			if (typeof renderElementId !== "undefined" && typeof loadingType !== "undefined") {

				var conteudo = '';
				switch(loadingType) {
					case 'central':
						conteudo = "<div id='divGif' class='row center clearfix'><img src='"+imgLoading+"' alt='Carregando'><span class='text--accessHide'>Aguarde o conteúdo ser carregado</span></div>";
						break;
					case 'central-mini':
						conteudo = "<div id='divGif' class='row center clearfix'><img src='"+imgLoadingMini+"' alt='Carregando'><span class='text--accessHide'>Aguarde o conteúdo ser carregado</span></div>";
						break;
					case 'texto-apoio':
						conteudo = "<div id='divGif' class='row clearfix'><img src='"+imgLoading+"' class='left' alt='Carregando'><p class='left margem-cima20 margem-esquerda20'>Aguarde o conteúdo ser carregado</p></div>";
						break;
					case 'texto-apoio-mini':
						conteudo = "<div id='divGif' class='row clearfix'><img src='"+imgLoadingMini+"' class='left' alt='Carregando'><p class='left margem-cima10 margem-esquerda10'>Aguarde o conteúdo ser carregado</p></div>";
						break;

				}
				var target = $('#'+renderElementId);
				target.append(conteudo);
			}
		}
	});
})(window);


var setAuthToken = function(authTokenValue) {
	if(authTokenValue !== undefined && authTokenValue !== null) {
		authToken = authTokenValue;
	}
};

var setClientId = function(clientIdValue) {
	if(clientIdValue !== undefined && clientIdValue !== null) {
		clientId = clientIdValue;
	} 
};

var setFlowId = function(flowIdValue) {
	if(flowIdValue !== undefined && flowIdValue !== null) {
		flowId = flowIdValue;
	} 
};

var setSegmento = function(segmentoValue) {
	if(segmentoValue !== undefined && segmentoValue !== null) {
		segmento = segmentoValue;
	} 
};

function Router() {
	var routerUi = new RouterUi(window);
	
	if (typeof clientId == 'undefined') {
		clientId = ' ';
	}
	
	if (typeof flowId == 'undefined') {
		flowId = ' ';
	}
	
	if (typeof segmento == 'undefined') {
		segmento = ' ';
	}

	var defineAjaxProperties = function(options) {
		return {
			url : routerUrl,
			method : 'post',
			data : options.data,
			cache : false,
			headers : {
				"op" : options.op,
				"renderType" : (typeof options.renderType === "undefined")? "parcialPage": options.renderType,
				"X-Auth-Token" : authToken,
				"X-CLIENT-ID" : clientId,
				"X-FLOW-ID" : flowId,
				"segmento" : segmento
			},
			success : function(dataCallBack, status, xhr) {
				setAuthToken(xhr.getResponseHeader("X-Auth-Token"));
				setClientId(xhr.getResponseHeader("X-CLIENT-ID"));
				setFlowId(xhr.getResponseHeader("X-FLOW-ID"));
				setSegmento(xhr.getResponseHeader("segmento"));
				options.successFunction.apply(undefined, [ dataCallBack, status, xhr ]);
				ready();
			},
			error : function(xhr, textStatus, errorThrown) {
				setAuthToken(xhr.getResponseHeader("X-Auth-Token"));
				setClientId(xhr.getResponseHeader("X-CLIENT-ID"));
				setFlowId(xhr.getResponseHeader("X-FLOW-ID"));
				setSegmento(xhr.getResponseHeader("segmento"));
				options.errorFunction.apply(undefined, [ xhr, textStatus, errorThrown ]);
				ready();
			}
		};
	};

	var readyCallBack = function() {
		uiConfiguration.configure();
	};

	var ready = function() {
		$(document).ready(readyCallBack);
	};

	this.performRequest = function(op, renderElementId, callbackFunction, data, loading) {
		$.event.trigger({type: "conteudo:carregando"});

		$.ajax(defineAjaxProperties({
			data : data,
			op : op,
			showLoading : loading === false ? false : true,
			renderType : routerUi.contentDivExist()?"parcialPage":"fullPage",
			successFunction : function(dataCallBack, xhr) {
				analytics.pushEventPageView(op);
				routerUi.renderPageParcial(dataCallBack, renderElementId, callbackFunction);
			},
			errorFunction : function(xhr, textStatus, errorThrown){
				defaultErrorFunction(xhr, textStatus, errorThrown, renderElementId);
			}
		}));

	};

	this.loadPage = function(op) {
		$.event.trigger({type: "conteudo:carregando"});

		$.ajax(defineAjaxProperties({
			op : op,
			renderType : routerUi.contentDivExist()?"parcialPage":"fullPage",
			successFunction : function(dataCallBack, xhr) {
				analytics.pushEventPageView(op);
				routerUi.renderPageParcial(dataCallBack);
			},
			errorFunction : defaultErrorFunction
		}));
	};

	this.performRequestDownload = function(op, data, dataArray) {

		if (isInternetExplorer9OrBellow()) {

			var formIe9 = $('<form id="formDownloadIE9" action="' +  routerUrl + '" method="POST"></form>');

			$('<input>').attr({
			    type: 'hidden',
			    name: 'download',
			    value: "true"
			}).appendTo(formIe9);

			$('<input>').attr({
			    type: 'hidden',
			    name: 'op',
			    value: op
			}).appendTo(formIe9);

			$('<input>').attr({
				type: 'hidden',
			    name: 'X-Auth-Token',
			    value: authToken
			}).appendTo(formIe9);

			$('<input>').attr({
				type: 'hidden',
			    name: 'X-CLIENT-ID',
			    value: clientId
			}).appendTo(formIe9);
			
			$('<input>').attr({
				type: 'hidden',
			    name: 'X-FLOW-ID',
			    value: flowId
			}).appendTo(formIe9);
			
			$('<input>').attr({
				type: 'hidden',
			    name: 'segmento',
			    value: segmento
			}).appendTo(formIe9);

		    if (dataArray) {
				dataArray.forEach(function (element) {
					$('<input>').attr({
						type: 'hidden',
						name: element.name,
						value: element.value
					}).appendTo(formIe9);
				});
			}

			$('body').append(formIe9);

			$('#formDownloadIE9').submit();
			$('#formDownloadIE9').remove();

		} else {

			var xhr = new XMLHttpRequest(),
				navigator = this.navigator;

			// jQuery ainda não suporta retorno de blob
			xhr.onreadystatechange = function() {

				var isFile = function(disposition) {
					return disposition && disposition.indexOf('attachment') !== -1;
				};

				if (this.readyState == 4 && this.status == 200) {

					var filename = "",
						disposition = xhr.getResponseHeader('Content-Disposition');

					setAuthToken(xhr.getResponseHeader('X-Auth-Token'));
					setClientId(xhr.getResponseHeader("X-CLIENT-ID"));
					setFlowId(xhr.getResponseHeader("X-FLOW-ID"));
					setSegmento(xhr.getResponseHeader("segmento"));

					if (isFile(disposition)) {
						var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
							matches = filenameRegex.exec(disposition);

						if (matches != null && matches[1]) {
							filename = matches[1].replace(/['"]/g, '');
						}
						try {
							saveAs(this.response, filename === "" ? "documento" : filename);
						}
						catch(exception) {

							$.magnificPopup.open({
								items: {
									src: $('<div class="modulo modulo-lightbox" ><section><h3 class="line-bottom">Aviso</h3>Browser não suportado (Browser suportados Chrome 19 ou superior, Internet Explorer 10 ou superior, Firefox 4 ou superior, Opera 15 ou superior, Safari 6 ou superior)</section></div>')
								}
							});


						}

					} else {

						var fileReader = new FileReader();
						fileReader.readAsText(this.response);

						fileReader.onloadend = function () {
							routerUi.renderPageParcial(this.result);
	  					}
					}
				}
			}
			xhr.open('POST', routerUrl);
			xhr.responseType = 'blob';
			xhr.setRequestHeader("op", op);
			xhr.setRequestHeader("X-Auth-Token", authToken);
			xhr.setRequestHeader("X-CLIENT-ID", clientId);
			xhr.setRequestHeader("X-FLOW-ID", flowId);
			xhr.setRequestHeader("segmento", segmento);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send(data);
		}

	};

	var defaultErrorFunction = function(xhr, textStatus, errorThrown, renderElementId) {
		if (routerUi.contentDivExist()) {
			routerUi.renderPageParcial(xhr.responseText, renderElementId);
		} else {
			routerUi.renderPage(xhr.responseText);
		}
	};

	this.performRequestComplete = function(op, data) {
		$.event.trigger({type: "pagina:carregando"});

		$.ajax(defineAjaxProperties({
			data : data,
			op : op,
			renderType : routerUi.contentDivExist()?"parcialPage":"fullPage",
			successFunction : function(dataCallBack, xhr) {
				analytics.pushEventPageView(op);
				routerUi.renderPage(dataCallBack);
			},
			errorFunction : defaultErrorFunction
		}));
	};

	this.performRequestPopup = function(op, data, name, parametros) {
		$.event.trigger({type: "popoup:carregando"});

		$.ajax(defineAjaxProperties({
			data : data,
			op : op,
			renderType : routerUi.contentDivExist()?"parcialPage":"fullPage",
			successFunction : function(data, xhr) {
				analytics.pushEventPageView(op);
				routerUi.renderPagePopup(data, name, parametros);
			},
			errorFunction : defaultErrorFunction
		}));

	};

}

var isInternetExplorer9OrBellow = function() {
	return isIE() == 9 || isLegacyIE();
};

var isLegacyIE = function() {
	return isIE() == 8 || isIE() == 7;
};
var isIE = function() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
};

var executeFunctionByName = function(functionName, args) {

	var functionToBeExecuted = getFunctionByName(functionName);

	if(functionToBeExecuted === undefined) {
		return;
	}

	return functionToBeExecuted.apply(this, [args]);
};

var getFunctionByName = function(functionName) {
	var context = window;
	if(functionName === undefined) {
		return undefined;
	}

	var namespaces = functionName.split("."),
		func = namespaces.pop();

	for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	
	try {
		return context[func];
	} catch (exception) {
		return undefined;
	}
};

// ROUTER UI
// Responsavel por renderizar dados retornados pelo router

function RouterUi() {

	this.contentDivExist = function () {
		return $('#content');
	};

	var addAuthToken = function(data) {
		return data.replace("</body>", "<script>var authToken='" + authToken +"';</script></body>");
	};

	var addClientId = function(data) {
		if(clientId !== undefined && clientId !== null) {
				return data.replace("</body>", "<script>var clientId='" + clientId +"';</script></body>");
		}else{
				return data.replace("</body>", "<script>var clientId=" + clientId +";</script></body>");

		}
	};

	var addFlowId = function(data) {
		if(flowId !== undefined && flowId !== null) {
			return data.replace("</body>", "<script>var flowId='" + flowId +"';</script></body>");
		}else{
			return data.replace("</body>", "<script>var flowId=" + flowId +";</script></body>");
		}
	};
	
	var addSegmento = function(data) {
		if(segmento !== undefined && segmento !== null) {
			return data.replace("</body>", "<script>var segmento='" + segmento +"';</script></body>");
		}else{
			return data.replace("</body>", "<script>var segmento=" + segmento +";</script></body>");
		}
	};

	//executa function callBack data-callback-function do elemento que originou a requisição
	var executaCallbackFunction = function(callbackFunction, data) {

		var func = getFunctionByName(callbackFunction);
		if (func !== "undefined") {
			executeFunctionByName(callbackFunction, data);
			return true;
		}
		return false;
	};

	this.renderPage = function(data) {
		// IE zerava as variaveis no document.write, vamos precisa escrever o authToken sempre...
		data = addAuthToken(data);
		data = addClientId(data);
		data = addFlowId(data);
		data = addSegmento(data);
		
		if (isLegacyIE()) {
			$('html').remove();
			var newDoc = window.open(null, '_self');
			newDoc.document.write(data);
			newDoc.document.close();
			window.location.reload(true);
		} else {
			var newDoc = document.open("text/html", "replace");
			newDoc.write(data);
			newDoc.close();
		}

		$.event.trigger({type: "pagina:carregada"});
	};

	this.renderPagePopup = function(data, name, parametros) {
		data = addAuthToken(data);
		data = addClientId(data);
		data = addFlowId(data);
		data = addSegmento(data);

		var newDoc = window.open("", name, parametros, "false");
		if (isLegacyIE()) {
			newDoc.document.write(data);
			newDoc.document.close();
			window.location.reload(true);
		} else {

			newDoc.document.open();
			newDoc.document.write(data);
			newDoc.document.close();
		}

		$.event.trigger({type: "popoup:carregado"});
	};

	this.renderPageParcial = function(data, renderElementId, callbackFunction) {
	    if (renderElementId === undefined) {
			if (data.indexOf("id=\"content\"") != -1) {
				var routerUI = new RouterUi();
				routerUI.renderPage(data);
			} else {
				$("#content").html(data);
				$.event.trigger({type: "conteudo:carregado"});
			}
		} else {
			//executanto function posload passada no data do elemento
			if (typeof callbackFunction !== "undefined"){
				if (!executaCallbackFunction(callbackFunction, data)){
					$('#' + renderElementId).html(data);
				}
			} else {
				$('#' + renderElementId).html(data);
			}

			$.event.trigger({type: "conteudo:carregado"});
		}
	};

};


// ANALYTICS
var analytics = {

	existDataLayer: function (){
		return typeof dataLayer != 'undefined';
	},

	existAnalyticsPageName: function (op) {
		var gaName = op.split(';');
		return gaName[1]!='';
	},

	extractAnalyticsPageName: function (op) {
		var gaName = op.split(';');
		if (typeof pageNameAnalytics != 'undefined') {
            pageNameAnalytics = gaName[1];
		}
		return gaName[1];
	},

	pushEventPageView : function (op) {
		var portalAnalyticsSetado = "";
		if (typeof portalAnalytics != 'undefined') {
			portalAnalyticsSetado = portalAnalytics;
		}

		if (analytics.existDataLayer() && analytics.existAnalyticsPageName(op)) {
			dataLayer.push({
				'event' 					: 'pageView',
				'portal' 					: portalAnalyticsSetado,
				'nomePagina' 				: analytics.extractAnalyticsPageName(op)
			});
		}
	}
};





//op - DataOP
//data - Dados (JSON Object)
//successHandler - Handler que sera Chamado em Caso de Sucesso da Resposta
//errorHandler - Handler que sera Chamado em Caso de Erro
function performAjaxRequest(op, data, successHandler, errorHandler) {
	$.ajax({
		url: routerUrl,
		method: 'post',
		data: data,
		cache: false,
		dataType: 'json',
		showLoading: false,
		headers: {
			"op": op,
			"ajaxRequest": true,
			"X-Auth-Token" : authToken,
			"X-CLIENT-ID" : clientId,
			"X-FLOW-ID" : flowId,
			"segmento" : segmento,
			scrollToTop: false
		},
		success: function(data, textStatus, xhr) {
			setAuthToken(xhr.getResponseHeader("X-Auth-Token"));
			setClientId(xhr.getResponseHeader("X-CLIENT-ID"));
			setFlowId(xhr.getResponseHeader("X-FLOW-ID"));
			setSegmento(xhr.getResponseHeader("segmento"));
			if (successHandler != null) {
				successHandler(data, textStatus, xhr);
			}
		},
		error: function (xhr, textStatus, errorThrown) {
			setAuthToken(xhr.getResponseHeader("X-Auth-Token"));
			setClientId(xhr.getResponseHeader("X-CLIENT-ID"));
			setFlowId(xhr.getResponseHeader("X-FLOW-ID"));
			setSegmento(xhr.getResponseHeader("segmento"));
			if (errorHandler != null) {
				errorHandler(xhr, textStatus, errorThrown);
			}
		}
	});
};

