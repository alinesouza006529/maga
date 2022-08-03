
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
		$('#irParaConteudo').attr('aria-hidden', 'true');
		
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

/**
 * OBJETO ADOBE PARA TAGUEAMENTO
 */

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
			if(window.console){
				console.log("JSON dataLayer: "+JSON.stringify(analyticsData));
			}
			_satellite.track('async_content_load');
		}catch(err){
			if(window.console){
				console.log("Erro na chamada sendDataLayer");
			}
		}
	}

};
