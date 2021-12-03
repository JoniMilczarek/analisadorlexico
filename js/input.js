$(document).ready(function(){
	$('#insert_word').click(() => {
		var word = ($('#input_word').val()).toLowerCase();
		if(word){
			addWord(word);
		}
	});

	$('#search_word').keyup(() => {
		if(table.length > 0){
			validateWord();
		}
	});

	$('#input_word').on('keyup',function(e) {
		var word = ($('#input_word').val()).toLowerCase();
		var exprRegular = /([^A-Za-z_])/;
		if(exprRegular.test(word)){
			$('#insert_word').addClass('disabled');
			$('#input_word').val(word.replace(word.slice(-1), ''));
		} else {
			$('#insert_word').removeClass('disabled');
		}
		
		if(e.which == 13) {
			if(word){
				addWord(word);
			}
		}
	});

});

const addWord = word => {
	if (wordArray.indexOf(word) < 0 && word.length > 0) { 
		html = `<span class="dropdown-item addedWord">${word}<span onclick='rmvPalavras("${word}")'>${iconTrashHTML}</span>`;
		$(html).prop("onclick", `rmvPalavras('${word}')`);
		$('#input-field').append(html);
		wordArray.push(word);
		$('#input_word').val('');
	} 
	createWordState();
	table = createLinesFromTable();
	createTable(table);
};

const rmvPalavras = word => {
	var index = wordArray.indexOf(word);
	if (index >= 0 && word.length > 0) {
		wordArray.splice(index, 1);
		$(".addedWord").each(function() {
		    if ($(this).text().trim() == word.trim()) {
				$(this).hide();
		    }
		});
	}
	clear();
};

function clear() {
	$('#tabela_tbody').html('');
	$('#searched_words').html('');
	globalIteration = [0];
	globalState = 0;
	state = [[]];
	table 	= [];
	createWordState();
	table = createLinesFromTable();
	createTable(table);
};

// monta a tabela de estados a partir do array de palavras
const createWordState = () => {
	for(var i=0; i<wordArray.length; i++) {
		var estadoAtual = 0;
		var word = wordArray[i];
		for(var j=0; j<word.length; j++){
			if(typeof state[estadoAtual][word[j]] === 'undefined'){
				var proximoEstado = globalState + 1;
				state[estadoAtual][word[j]] = proximoEstado;
				state[proximoEstado] = [];
				globalState = estadoAtual = proximoEstado;
			} else {
				estadoAtual = state[estadoAtual][word[j]];
			}

			if(j == word.length - 1){
				state[estadoAtual]['final'] = true;
			}
		}
	}
};

const createLinesFromTable = () => {
	var estadosArray = [];
	for(var i=0; i<state.length; i++) {
		var aux = [];
		aux['estado'] = i;
		var primChar = 'a';
		var ultiChar = 'z';
		for(var j=primChar.charCodeAt(0); j<=ultiChar.charCodeAt(0); j++) {
			var varra = String.fromCharCode(j);
			if(typeof state[i][varra] === 'undefined'){
				aux[varra] = '-';
			} else {
				aux[varra] = state[i][varra];
			}
		}
		if(typeof state[i]['final'] !== 'undefined'){
			aux['final'] = true;
		}
		estadosArray.push(aux);
	};
	return estadosArray;
};

