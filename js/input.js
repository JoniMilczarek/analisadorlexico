var arrayPalavras = [];
var IteracaoDosEstados = [0];
var EstadoGlobal = 0;
var Estados = [[]];
var Tabela 	= [];

$(document).ready(function(){
	$('#insere_palavras').click(() => {
		var palavra = ($('#input_palavras').val()).toLowerCase();
		if(palavra){
			addPalavras(palavra);
		}
	});

	$('#buscar_palavras').keyup(() => {
		if(Tabela.length > 0){
			validaPalavra();
		}
	});

	$('#input_palavras').on('keypress',function(e) {
		var palavra = ($('#input_palavras').val()).toLowerCase();
		var exprRegular = /([^A-Za-z_])/;
		if(exprRegular.test(palavra)){
			$('#insere_palavras').addClass('disabled');
			$('#input_palavras').val(palavra.replace(palavra.slice(-1), ''));
		} else {
			$('#insere_palavras').removeClass('disabled');
		}
		
		if(e.which == 13) {
			if(palavra){
				addPalavras(palavra);
			}
		}
	});

});

const addPalavras = palavra => {
	if (arrayPalavras.indexOf(palavra) < 0 && palavra.length > 0) {
		html = `<a class="dropdown-item" href="#">${palavra}<span onclick='rmvPalavras("${palavra}")'>${iconTrashHTML}</span>`;
		$(html).prop("onclick", `rmvPalavras('${palavra}')`);
		$('#input-field').append(html);
		arrayPalavras.push(palavra);
		$('#input_palavras').val('');
	} 
	montaEstadoPalavra();
	Tabela = geraLinhasTabela();
	montaTabela(Tabela);
};

const rmvPalavras = palavra => {
	var index = arrayPalavras.indexOf(palavra);
	if (index >= 0 && palavra.length > 0) {
		arrayPalavras.splice(index, 1);
		$(".addedWord").each(function() {
		    if ($(this).text().trim() == palavra.trim()) {
				$(this).hide();
		    }
		});
	}
	limpaRefazAnalisador();
};

function limpaRefazAnalisador() {
	$('#tabela_tbody').html('');
	$('#palavras_encontradas').html('');
	IteracaoDosEstados = [0];
	EstadoGlobal = 0;
	Estados = [[]];
	Tabela 	= [];
	montaEstadoPalavra();
	Tabela = geraLinhasTabela();
	montaTabela(Tabela);
};

const montaEstadoPalavra = () => {
	for(var i=0; i<arrayPalavras.length; i++) {
		var estadoAtual = 0;
		var palavra = arrayPalavras[i];
		for(var j=0; j<palavra.length; j++){
			if(typeof Estados[estadoAtual][palavra[j]] === 'undefined'){
				var proximoEstado = EstadoGlobal + 1;
				Estados[estadoAtual][palavra[j]] = proximoEstado;
				Estados[proximoEstado] = [];
				console.log("Estados: ", Estados);
				EstadoGlobal = estadoAtual = proximoEstado;
				console.log("EstadoGlobal: ", EstadoGlobal);
			} else {
				console.log("Estados: ", Estados);
				estadoAtual = Estados[estadoAtual][palavra[j]];
				console.log("estadoAtual: ", estadoAtual);
			}

			if(j == palavra.length - 1){
				Estados[estadoAtual]['final'] = true;
			}
		}
	}
};

const geraLinhasTabela = () => {
	var estadosArray = [];
	for(var i=0; i<Estados.length; i++) {
		var aux = [];
		aux['estado'] = i;
		var primChar = 'a';
		var ultiChar = 'z';
		for(var j=primChar.charCodeAt(0); j<=ultiChar.charCodeAt(0); j++) {
			var varra = String.fromCharCode(j);
			if(typeof Estados[i][varra] === 'undefined'){
				aux[varra] = '-';
			} else {
				aux[varra] = Estados[i][varra];
			}
		}
		if(typeof Estados[i]['final'] !== 'undefined'){
			aux['final'] = true;
		}
		estadosArray.push(aux);
	};
	return estadosArray;
};

