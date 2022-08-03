 
/* Arquivo de configuração de enconding UTF-8 with BOM, favor não alterar */

/*
********************************************
* msite
********************************************
*/

var mesesMap = {
	1: "janeiro", 	2: "fevereiro",	3: "mar\u00e7o",
	4: "abril",		5: "maio",		6: "junho",
	7: "julho", 	8: "agosto", 	9: "setembro",
	10:"outubro", 	11:"novembro",	12:"dezembro"
};

var getNomeMes = function(mes) { return mesesMap[mes]; }

var mesesAbreviadosMap = {
	1: "jan", 	2: "fev",	3: "mar",
	4: "abr",	5: "mai",	6: "jun",
	7: "jul",	8: "ago",	9: "set",
	10: "out",	11: "nov",	12: "dez"
};

var getNomeMesAbreviado = function(mes) { return mesesAbreviadosMap[mes]; }

function fnControleBotaoMobile(){
	$('.btn-mobile').css('margin-top', '0px');

	var body = $('body').height(); 
	var doc = $(document).height();
	
	if (body < doc) {
		$('.btn-mobile').css('margin-top', doc - body);
	} else {
		$('.btn-mobile').css('margin-top', '20px');
	}
}

function fnControleLogonAvisoSenha() {
	
	$('.senha-eletronica-ac').removeClass('hidden');

	altura_body 	= $('body').height();
	altura_header 	= $('header').height();
	altura_content 	= $('section.container').height();
	altura_msg 		= $('.senha-eletronica-ac').height() + 28;
	
	margin = altura_body - (altura_header + altura_content) - altura_msg;
	
	$('.senha-eletronica-ac').css("margin-top", margin);
}

function fnMostrarAlerta(){
	var existemAlertas = $(".alert-msite .alert-text .alert-style").length != 0 ? true : false;
	if (existemAlertas){
		$(".alert-msite").removeClass("hidden");
		$(".alert-style").removeClass("hidden");
		$(".alert").addClass("alert-color");
	}
}

function fnOcultarAlerta (){
	$(".alert").removeClass("alert-color");
	$(".alert-msite").addClass("hidden");
	$(".alert-style").addClass("hidden");
	$(".alert-text").html("");
}

function fnRemoverIrParaConteudo(interval)
{
	html = $('#irParaConteudo').html();
	
	if(html != undefined && html != 'undefined')
	{
		$('#irParaConteudo').remove();
		
		clearInterval(interval);
	}
}

function fnControlarAriaHiddenModal(acao, elModal)
{
	if(acao != undefined && acao != 'undefined' && acao == 'abrir')
	{
		$('.ctrl-ah-content').attr('aria-hidden', 'true');
		$('.ctrl-ah-modal').attr('aria-hidden', 'true');
		$(elModal).attr('aria-hidden', 'false');
	}
	else
	{
		$('.ctrl-ah-content').attr('aria-hidden', 'false');
		$('.ctrl-ah-modal').attr('aria-hidden', 'true');
	}
}

function fnCopiarTextoClipboard(btnAntes, btnDepois, txt)
{
	botaoCopiar = document.querySelector(btnAntes);  

	botaoCopiar.addEventListener('click', function(event) 
	{
		if (navigator.userAgent.match(/ipad|ipod|iphone/i))
		{
			elConteudo = $(txt)[0];
			
			oldContentEditable = elConteudo.contentEditable;
			oldReadOnly = elConteudo.readOnly;
			
			elConteudo.contenteditable = true;
			elConteudo.readonly = false;

			range = document.createRange();
			range.selectNodeContents(elConteudo);

			selRange = window.getSelection();
			selRange.removeAllRanges();
			selRange.addRange(range);

			elConteudo.setSelectionRange(0, 99999);

			elConteudo.contentEditable = oldContentEditable;
			elConteudo.readOnly = oldReadOnly;
		}
		else
		{			
			elConteudo = document.querySelector(txt);  
			elConteudo.select();
		}

		try 
		{
			if(document.execCommand('copy'))
			{
				if(btnDepois != "" && elConteudo.textContent == $(txt).text())
				{
					$(btnAntes).hide();
					$(btnDepois).removeClass('hidden');
					
					$(".app-modal-gerar-codigo-barras .fechar a").click(function(e)
					{
						$(btnAntes).show();
						$(btnDepois).addClass('hidden');
					});
					
					$(btnDepois).focus();
				}
			}
		} 
		catch(err) 
		{
			console.log('Erro na cópia do código de barras.');
		}  

		window.getSelection().removeAllRanges();  
	});      
}
window.ItauJs = {};

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
    	        		ItauJs.Exception().CatchAjaxException(data, function(){
    	            		options.success(data);
    	            	}, function(error) {
    	            		options.error(error);
    		            });
    	    		};
    	    	}else{
    	    		params.success = function(data){
    	        		ItauJs.Exception().CatchAjaxException(data, function(){
    	            		options.success(data);
    	            	});
    	    		};
    	        }
    	    }
    	    
    	 	return $.ajax(params);
			
    	};
    	
    }

    return $scopePrivate.init();
};

$(function() {
	ItauJs.Exception();
});


/*
********************************************
* ui-configuration-msite
********************************************
*/

(function(window){	

	window.loadHomePage = function(op, fn) {
		
		$.event.trigger({type: "conteudo:carregando"});
		
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
				
				$.event.trigger({type: "conteudo:carregado"});
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

var uiConfigurationTitle = "";
var uiConfiguration = {
	
	configure : function(executaFns) 
	{
		var thisClass = this;
		
		//Verifica se pagina carregada contem H1 e injeta no titulo da pagina, caso contrario injeta titulo padrao
		var configureTituloPaginaDinamico = function()
		{
			if(uiConfigurationTitle == "")
				uiConfigurationTitle = $("head title").text();
			
			// preenche title
			var valTitle ="";
			
			if ($("#content h1").text().trim() != "") 
			{
				valTitle = $("#content h1").text() + " - " + uiConfigurationTitle;
			} 
			else 
			{
				valTitle = uiConfigurationTitle;
			}
		   
			$("head title").text(valTitle);
		}
	   	
		var configureMasks = function()
		{
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

			/* Valores */
			$('.mask-porcentagem').mask('##0,00%', {
				reverse : true
			});
			
			/* Conta Dac*/
			var options =  {
				reverse : true
			};
			$('.mask-conta-dac').mask('00000-0', options);
		};

		var configureForms = function() 
		{			
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

		// implementar MSITE
		var configureAccordions = function() 
		{
			$(document).addDelegateEvent("click","a.accordion",function(event)
			{
		        event.preventDefault();
				
		        var elementoClicado = $(this);
				
		        if(elementoClicado.parent().hasClass('aberto'))
				{
		            elementoClicado.attr('aria-expanded','false');
					
		            if(!elementoClicado.find('span').hasClass('abre-fecha'))
					{
		            	elementoClicado.find('span').text('exibir');
		            }
					
		            elementoClicado.parent().removeClass('aberto').addClass('fechado');
		            elementoClicado.next('div').attr('aria-hidden','true');

		        }
				else
				{
		            elementoClicado.attr('aria-expanded','true');
					
		            if(!elementoClicado.find('span').hasClass('abre-fecha'))
					{
		            	elementoClicado.find('span').text('ocultar');
		            }
		            elementoClicado.parent().removeClass('fechado').addClass('aberto');
		            elementoClicado.next('div').attr('aria-hidden','false');
		        }
				
		        $(this).next('.conteudo').stop(true, true).slideToggle(200); //abre e fecha o accordion
		    });
		};

		var configureCharacterCounter = function() 
		{
			$(".maxlength").unbind();
			$(".maxlength").keyup(function(event) 
			{
				var target = $(this).parent().find("#char-counter");
				var max = target.attr('maxchar');
				var len = $(this).val().length;
				var remain = max - len;

				if (len > max) 
				{
					var val = $(this).val();
					$(this).val(val.substr(0, max));
					remain = 0;
				}
				
				target.html(remain);
			});
		};

		var configureMaxlength = function() 
		{
			$(".maxLen").unbind();
			$(".maxLen").bind("keyup keypress", function() 
			{
				max = $(this).attr("maxlength");
				val = $(this).val();
				
				if(val.length >= max)
                {
					$(this).val(val.substring(0, 16));
					
					return false;
                }
			});
		};

		//revalidar
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
		
		// A rotina abaixo mostra uma tela com um gif de wait.
		// Início
		// revalidar
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

		var startTabindexDinamico = function(){
			defineTabindexDinamico(0);
		}

		//Wai-aria dinamico para botões (role='button')
		// revalidar
		var configureRoleButton = function(){
			$('.btn,.btn-secundario,.btn-fluxo,.btn-pequeno,.btn-ico,.btn-action').attr('role','button');
		}

		if (executaFns==true)
		{
			configureTituloPaginaDinamico();
			configureMasks();
			configureCharacterCounter();
			configureMaxlength();
			startTabindexDinamico();
			configureRoleButton();
		}
		
		if($("html").hasClass("uiConfiguration-runed") == false)
		{
			$("html").addClass("uiConfiguration-runed");
			$("body").off();
			
			configureTituloPaginaDinamico();
			configureMasks();
			configureCharacterCounter();
			configureMaxlength();
			startTabindexDinamico();
			configureRoleButton();
			
			configureForms();
			configureAccordions();
			configureLinks();
			configureLoading();
			thisClass.configureAjaxComplete();
		};
		
		$(function(){
			$.event.trigger({
				type: "ui-cofiguration:executado",
				forceRefresh : (executaFns == true) ? true : false
			});
		});
		
	},
	startTabIndexDinamico: function()
	{
		//tabIndex Dinamico para o miolo da pagina
		defineTabindexDinamico(0);
	},
	configureAjaxComplete: function() 
	{		
		$(document).ajaxStop(function()
		{
			if(sessionStorage.isPessoaFisica === "false"){
				history.pushState({},"","router#30horas");
			}
		});
	
		$( document ).ajaxComplete(function( event, xhr, settings ) 
		{				
			setTimeout(function ()
			{
				uiConfiguration.configure(true);
			}, 500);
		});
		
		$(document).ajaxSend(function( event, jqxhr, settings )
		{
			var urlSummer = (settings.url.indexOf("summer-cdn"));
			
			if(settings.headers != undefined)
			{
				if((settings.headers.scrollToTop != undefined && settings.headers.scrollToTop == false) || urlSummer > -1)
				{
					return false;
				}
			} 
			else if(urlSummer > -1)
			{
				return false;
			}
			
			$("html, body").animate({scrollTop: 0}, 10, 'swing');
		});
	}
};

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
		tabconteudo = $("header, #content, #complementarySection, footer");
		tabpage =  $("[tabindex != -1]");
		// 3 devido aos links do menu acessivel 1=ir para o conteudo, 2=ir para o menu , 3=ir para a busca
		i = 3;
	} else {
		i = tabindexSair;
		tabconteudo = $("#content, #complementarySection, footer");
		tabpage =  $("#content [tabindex != -1], footer [tabindex != -1]");
		// TODO Necessário rever acessibilidade
		// elementoEmFoco = "#irParaConteudo";
	}

	tabpage.removeAttr("tabindex");
	
	$("#irParaConteudo").attr("tabindex", 0);

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
	$("section .main :visible [tabindex]:first").focus();
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

 $(document).ready(function() 
{
	var activeElRole = "";
	var activeElID = "";
	
	var fnCarregado = function() {
		
		el = $('body').find('[id="'+activeElID+'"][role="'+activeElRole+'"]');

		if(el.length == 0)
			$('body :first-child :visible [tabindex]:first').focus();
		else
			el.focus();
	}
	
	$(document).on("conteudo:carregando", function() {
		
		activeElRole = $(document.activeElement).attr('role');
		activeElID = $(document.activeElement).attr('id');
	});
	
	$(document).on("conteudo:carregado", function() {
		
		setTimeout(function () { fnCarregado() }, 1000);
	});

	$(document).on("pagina:carregada", function() {
		
		setTimeout(function () { fnCarregado() }, 1000);
	});
});

/*
********************************************
* jquery-itau-validation-msite
********************************************
*/

(function($)
{
	$.validador = {};
	$.validador.fn = {}; // Agrupamento das funções de validação da biblioteca.
	$.validador.fn.condicoes = {};
	$.validador.util = {}; //Agrupamento de funções utilitárias

	/*
	 * Função responsável por atribuir as configurações padrões ou customizadas 
	 * da biblioteca de validação do formulário
	 */
	$.validador.setDefaults = function(settings) 
	{
		$.validador.configuracao = {
			debug: false
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

	$.validador._mask = function (regra) 
	{
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
	
	$.validador.fn.condicoes.notin = function (premissa) 
	{
		var atual = null;

		if (this.is(":radio")) 
		{
			atual = $('input:radio[name="' + this.attr("id") + '"]:checked').val();
		} 
		else 
		{
			atual = this.val();
		}

		if (atual == undefined) return false;

		for (var valor in premissa.notin) 
		{
			if ((valor == atual)) 
			{
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

	$.validador.fn.condicoes.selecionado = function(premissa) 
	{
		var name = $(this).attr("name");
		
		if ($(this).is(":radio")) 
		{
			var selector = 'input:radio[name="'+name+'"]';
			return premissa.selecionado == $(selector).is(":checked");
		} 
		else if ($(this).is(":checkbox")) 
		{
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
				console.log(saidalog);
			} catch (e) {
				alert(saidalog);
			} 
		}  else {
			if( window.console != null ) {
				console.clear();
				$(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
					console.clear();
				})
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
			}
		});
	};

	$.fn.validar = function(callbacks) 
	{
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
	
	return this;

})(jQuery);

/*
********************************************
* formValidationFeedbackMsite
********************************************
*/

var $scopeAccessibility = {};

$scopeAccessibility.removeAccessibleError = function(element){
	var idElementError = $(element).attr("id") + "_error";
	$("#"+idElementError).remove();
	$(element).removeAttr("aria-invalid");
	$(element).removeAttr("aria-describedby");
	
};

$scopeAccessibility.addAccessibleError = function(element, msgError)
{
	try
	{
		if ($(element)) 
		{
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
	} 
	catch (err) 
	{
		console.log(err);
	};
};

$scopeAccessibility.onFocusAccessibility = function (element)
{
	$(element).on("focus", function()
	{
		$scopeAccessibility.addAccessibleError($(this), $($($(this).parent()).children(".mensagem-erro")).children(".erro-campo").text());
	});
};

function tratarSaidaErro(erros, inverterToolTip) 
{
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

function initTextInputEvents(id, mensagem) 
{	
	var objeto = "#"+id;
	
	$(objeto).addClass("invalido");
	
	$(objeto).focus(function() 
	{
		if ($(objeto).hasClass("invalido") && !$(objeto).hasClass("hasTooltip")) 
		{
   			printTooltip(objeto, mensagem);
      
			$(objeto).addClass("hasTooltip");		
		}
	});
	
	$(objeto).blur(function()
	{
		if ($(objeto).hasClass("hasTooltip")) 
		{
			$(objeto).prev().remove();
			$(objeto).removeClass("hasTooltip");
			$scopeAccessibility.removeAccessibleError($(objeto).attr("id"));
		}
	});
	
	$(objeto).bind('keyup', function(e) 
	{
		 var code = e.keyCode || e.which;
		 
		 if(code != 9 && code != 16) 
		 {
			if ($(objeto).hasClass("hasTooltip")) 
			{
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
	
	$(objeto).change(function() 
	{
		if ($(objeto).hasClass("hasTooltip")) 
		{
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

function printTooltip(objeto, mensagem) 
{
  	var tooltipHtml = "<div class='mensagem-erro'><span class='erro-seta' style='left: 8px'></span><span class='erro-campo'>{0}</span></div>";
  	
 	$(objeto).before($.validador.util.formatar(tooltipHtml, [mensagem]));
  	adjustTooltipPosition(objeto);
}

function adjustTooltipPosition(objeto) 
{	
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

function getElementPosition(element) 
{
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

function base64toBlob(base64Data, contentType, sliceSize)
{
	contentType = contentType || '';
	sliceSize = sliceSize || 512;

	var byteCharacters = atob(base64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) 
	{
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
	
		for (var i = 0; i < slice.length; i++) 
		{
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, {type: contentType});
	
	return blob;
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


    pushVisitor: function(tipoCliente, segmento, iDPF, iDPJ, iDOperador) {
        analyticsData.visitor = {};
        if(tipoCliente != ""){analyticsData.visitor.tipoCliente = tipoCliente;}
        if(segmento != ""){analyticsData.visitor.segmento = segmento;}
        if(iDPF != ""){analyticsData.visitor.iDPF = iDPF;}
        if(iDPJ != ""){analyticsData.visitor.iDPJ = iDPJ;}
        if(iDOperador != ""){analyticsData.visitor.iDOperador = iDOperador;}
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
			if (typeof _satellite !== 'undefined') { _satellite.track('async_content_load'); }
			if (typeof _frameworkDA !== 'undefined') { _frameworkDA.Track(); }
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

/**
 * OBJETO ADOBE PARA TAGUEAMENTO
 */

var msiteAdobeExibirJSON = false;

var msiteAdobeDataLayer = {

	/**
	 * Funcao responavel por iniciar o objeto vazio.
	 */
	init: function() {
		window.analyticsData = {};

		return this;
	},

	/**
	 * Funcao responsavel por montar o objeto obrigatorio (SITE) com informações do site (nome; ambiente; negocio) utilizado no tagueamento adobe.
	 *
	 * @param nome:			String - Obrigatorio - Nome do site - Ex.: 'IT'
	 * @param ambiente: 	String - Obrigatorio - Usuario Logado ou Nao Logado - Ex.: 'LG'
	 * @param negocio:		String - Obrigatorio - Unidade de negocio do banco - Ex.: 'PF'
	 * @param tipoDeCanal:	String - Obrigatorio - Tipo de Canal Ex.: 'Msite'
	 */
	msitePushSite: function(_nome, _ambiente, _negocio, _tipoDeCanal) {
		//Popula o objeto SITE
		analyticsData.site = {};
		if(_nome && _nome != null && _nome != "" ){analyticsData.site.nome = _nome;}
		if(_ambiente && _ambiente != null && _ambiente != "" ){analyticsData.site.ambiente = _ambiente;}
		if(_negocio && _negocio != null && _negocio != "" ){analyticsData.site.negocio = _negocio;}
		if(_tipoDeCanal && _tipoDeCanal != null && _tipoDeCanal != "" ){analyticsData.site.tipoDeCanal = _tipoDeCanal;}
	},

	/**
	 * Funcao responsavel por montar o objeto obrigatorio (PAGE) com informações da pagina acessada (nome; url; 
	 * secao; subSecao1; subSecao2; subSecao3; idTecnico; ambiente; partnerForm) utilizado no tagueamento adobe.
	 *
	 * @param nome:		   String - Obrigatorio - 	  Nome da pagina - Ex.: 'IT:LG:PF:Cartoes:Alterar:Lim';
	 * @param url:		   String - Obrigatorio - 	  URL da pagina - Ex.: 'www.itau.com.br'
	 * @param secao: 	   String - Obrigatorio - 	  Secao onde se encontra a pagina - Ex.: 'Cartoes'
	 * @param subSecao1:   String - NAO Obrigatorio - Primeiro nivel da sub-secao da pagina - Ex.: 'Alterar'
	 * @param subSecao2:   String - NAO Obrigatorio - Segundo nivel da sub-secao da pagina - Ex.: 'Limitedecredito'
	 * @param subSecao3:   String - NAO Obrigatorio - Terceiro nivel da sub-secao da pagina - Ex.: '' (vazio)
	 * @param idTecnico:   String - NAO Obrigatorio - ID Tecnico da página - Ex.: 'IL01SPNBMontaHome'
	 * @param ambiente:	   String - NAO Obrigatorio - Se eh Internet Atual, Nova Internet ou Convivencia (Valores: IA | NI | Conv) - Ex.: 'NI'
	 * @param partnerForm: String - NAO Obrigatorio - Nome do parceiro onde o formulario esta inserido - Ex.: 'Multiplus'
	 */
	msitePushPage: function(_nome, _url, _secao, _subSecao1, _subSecao2, _subSecao3, _idTecnico, _ambiente, _partnerForm) {
		//Popula o objeto PAGE
		analyticsData.page = {};
		if(_nome && _nome != null && _nome != ""){analyticsData.page.nome = _nome;}
		if(_url && _url != null && _url != ""){analyticsData.page.url = _url;}
		if(_secao && _secao != null && _secao != ""){analyticsData.page.secao = _secao;}
		if(_subSecao1 && _subSecao1 != null && _subSecao1 != ""){analyticsData.page.subSecao1 = _subSecao1;}
		if(_subSecao2 && _subSecao2 != null && _subSecao2 != ""){analyticsData.page.subSecao2 = _subSecao2;}
		if(_subSecao3 && _subSecao2 != null && _subSecao3 != ""){analyticsData.page.subSecao3 = _subSecao3;}
		if(_idTecnico && _idTecnico != null && _idTecnico != ""){analyticsData.page.idTecnico = _idTecnico;}
		if(_ambiente && _ambiente != null && _ambiente != ""){analyticsData.page.ambiente = _ambiente;}
		if(_partnerForm  && _partnerForm  != null && _partnerForm != ""){analyticsData.page.partnerForm = _partnerForm;}
	},

	/**
	 * Funcao responsavel por montar o objeto (VISITOR) com informações do cliente que acessou a 
	 * pagina (tipoCliente; segmento; iDPF; iDPJ; iDOperador) utilizado no tagueamento adobe.
	 *
	 * @param segmento:	   String - Obrigatorio Se Disponivel - Segmento ao qual o cliente pertence - Ex.: 'Varejo; Uniclass; Person; Private';
	 * @param iDPF:		   String - Obrigatorio Se Disponivel - CPF do cliente com hash - Ex.: '23aF1235ewehr23...'
	 */
	msitePushVisitor: function(_segmento, _iDPF) {
		analyticsData.visitor = {};
		if(_segmento && _segmento != null && _segmento != ""){analyticsData.visitor.segmento = _segmento;}
		if(_iDPF && _iDPF != null && _iDPF != "") { analyticsData.visitor.iDPF = _iDPF; }
	},

	/**
	 * Funcao responsavel por montar o objeto (PRODUCT) com informações de produtos, eh OBRIGATORIO em 
	 * todas as paginas de produtos e fluxos de compra (carrinho, pagamento, confirmação e outras).
	 *
	 * @param _event:		String				- NAO Obrigatorio - Evento Adobe relacionado ao produto - Ex.: 'prodView; scOpen; scAdd; scRemove; scCheckout; purchase';
	 * @param items:		product.items		- Obrigatorio	 - Array de objetos com informações (product.items) dos produtos.
	 *		Ex.: "items":[
	 *						{"sku":"12345",  "merchandising": {"FDG:DNdoCartao":"4243646",   "FDG:TipoDeFatura ":"sms"}},    "incrementor": ["ncc_fatura_digital"]},
	 *						{"sku":"345678", "merchandising": {"FDG:DNdoCartao":"252634",    "FDG:TipoDeFatura ":"email"}},  "incrementor": ["ncc_fatura_digital"]},
	 *						{"sku":"54321",  "merchandising": {"FDG:DNdoCartao":"342634613", "FDG:TipoDeFatura ":"correio"}},"incrementor": ["ncc_fatura_correio"]}
	 *					 ]
	 */
	msitePushProduct: function(_event, _items) {
		analyticsData.product = {};
		if(_event && _event != null && _event != ""){analyticsData.product.event = _event;}
		if(_items && _items != null && _items != ""){analyticsData.product.items = _items;}
	},

	/**
	 * Funcao responsavel por montar o objeto (ITEM) que sera incluido em um array que sera incluido em um objeto (PRODUCT).
	 * 
	 * @param sku:			 String	- Obrigatorio 	  - SKU do produto					 - Ex.: '4356'
	 * @param merchandising: Objeto - NAO Obrigatorio - Detalhes do produto				 - Ex.: "merchandising":{"FDG:DNdoCartao":"4243646","FDG:TipoDeFatura":"sms"}
	 * @param incrementor:	 String - NAO Obrigatorio - Métricas relacionadas ao produto - Ex.: "ncc_fatura_digital";"ncc_fatura_correio"
	 */
	msitePushProductItem: function(_categoria, _nome, _sku, _merchandising) {
		//Limpeza do objeto
		var item = {};

		//Popula o objeto ITEM
		if(_sku && _sku != null && _sku != "" ){item.sku = _sku;}
		if(_categoria && _categoria != null && _categoria != ""){item.categoria = _categoria;}
		if(_nome && _nome != null && _nome != ""){item.nome = _nome;}
		if(_sku && _sku != null && _sku != ""){item.sku = _sku;}
		if(_merchandising && _merchandising != null && _merchandising != ""){item.merchandising = _merchandising;}		
		
		return item;
	},

	/**
	 * Funcao responsavel por montar o objeto (CUSTOM) que contem todos os dados personalizados 
	 * que serao utilizados em variaveis de Conversao, de Trafico e em Eventos.
	 * 
	 * @param _chave:  String				- Obrigatorio		- Chave vinculada ao parametro _valor	- Ex.: "nacionalidade";"sexo"
	 * @param _valor:  String				- Obrigatorio		- Valor vinculado ao parametro _chave	- Ex.: "brasileiro";"masculino";"feminino"
	 * @param _evento: Array(custom.events)	- NAO Obrigatorio	- ----------------------------------	- Ex.: "events": ["funil_cancelamento_dados",
	 *																													  "funil_cancelamento_simulacao",
	 *																													  "funil_cancelamento_comprovante",
	 *																													  "funil_cancelamento_efetivacao"];
	 */
	msitePushCustom: function(_chave, _valor, _eventos) {
		analyticsData.custom = {};
		if(_chave && _chave != null && _chave != ""){analyticsData.custom[_chave] = _valor;}
		if(_eventos && _eventos != null){
			if (Array.isArray(_eventos)) {
				analyticsData.custom.events = _eventos;

			} else {
				analyticsData.custom.events.push(_eventos);
			}
		}
	},

	/**
	 * Funcao responsavel por montar o objeto obrigatorio (RULE) que indica o tipo de regra que deve ser tratada pela Adobe Analytics
	 * 
	 * @param _rule:  String - Obrigatorio - Indica o tipo de regra que deve ser tratada pela Adobe Analytics, 2 valores possiveis.
	 *					- pageLoad: Deve ser utilizado sempre que o disparo do dataLayer ocorrer no carregamento da pagina. Responsavel por contabilizar um pageview.
	 *					- customLink: Deve ser utilizado sempre que o disparo do dataLayer ocorrer apos o carregamento da pagina, por exemplo, 
	 *								  em um evento de click a um link ou botão. Nao contabiliza um pageview
	 */
	msitePushRule: function(_rule) {
		//Popula o objeto RULE se for "pageLoad" ou "customLink"
		if(_rule == "pageLoad" || _rule == "customLink"){analyticsData.rule = _rule;}
	},

	sendDataLayer: function() {
		try{
			if(window.console && msiteAdobeExibirJSON){
				console.log("JSON dataLayer: "+JSON.stringify(analyticsData));
			}
			if (typeof _satellite !== 'undefined') { _satellite.track('async_content_load'); }
			if (typeof _frameworkDA !== 'undefined') { _frameworkDA.Track(); }
		}catch(err){
			if(window.console){
				console.log("Erro na chamada sendDataLayer");
			}
		}
	}

};
