const createTable = itemTab => {
	var tabela = $('#tabela_tbody');
	tabela.html('');
	for(var i=0; i<itemTab.length; i++){
		var tr = $(document.createElement('tr'));
		var td = $(document.createElement('td'));
		if(itemTab[i]['final']){
			td.html('q' + itemTab[i]['estado'] + '*');
			td.addClass('tem-sel center  bold');
		} else {
			td.html('q' + itemTab[i]['estado']);
			td.addClass('tem-sel center  bold');
		}
		tr.append(td);
		tr.addClass('linha_'+itemTab[i]['estado']);
		var primChar = 'a';
		var ultiChar = 'z';
		for(var j=primChar.charCodeAt(0); j<=ultiChar.charCodeAt(0); j++) {
			var varra = String.fromCharCode(j);
			var td = $( document.createElement('td') );
			td.addClass('coluna_'+varra+' center');
			if(itemTab[i][varra] != '-'){
				td.html('q' + itemTab[i][varra]);
				td.addClass('tem-sel');
			} else {
				td.html('-').addClass(' bold');
			}
			tr.append(td);
		}
		tabela.append(tr);
	}
};

const validateWord = () => {
	var words = ($('#search_word').val()).toLowerCase();
	
	if(words.length == 0){
		clearHighlight();
	}
	var state = 0;
	var stateError = false;
	
	for(var i=0; i<words.length; i++) {
		var exprRegular = /([a-z_])/;
		if(exprRegular.test(words[i]) && stateError == false){
			createHighlight(state, words[i], table[state][words[i]]);
			
			if(table[state][words[i]] != '-'){ // se o state não for de erro, ele aceita
				state = table[state][words[i]];
			} else { // Rejeita caso o state seja de erro
				stateError = true;
			}
		} else if(words[i] == ' '){
			var plvrEncontrada = `<span class='right'><i class="far fa-check-circle"></i></span>`;
			var plvrNaoEncontrada = `<span class='right'><i class="fas fa-minus-circle"></i></span>`;
			
			if (stateError == false) {
				if (table[state]['final']) {
					$('#searched_words').append(`<a class="dropdown-item" href="#">${words}</a>`);
					$('#modal').find('.modal-title').html('Palavra Encontrada!');
					$('#modal').find('.modal-body').html('<p>Sua palavra foi validada e encontrada entre as palavras cadastradas.</p>');
					$('#modal').modal('show');
				} else {
					$('#modal').find('.modal-title').html('Palavra Incompleta!');
					$('#modal').find('.modal-body').html('<p>Quase... Você quase acertou uma palavra, ela ficou imcompleta, tente novamente.</p>');
					$('#modal').modal('show');
				}
			} else {
				$('#modal').find('.modal-title').html('Palavra Inesistente!');
				$('#modal').find('.modal-body').html('<p>Essa palavra ainda não foi cadastrada! Apenas palavras cadastradas podem ser analisadas lexicamente.</p>');
				$('#modal').modal('show');
			}
			clearHighlight();
			$('#search_word').val('');
		} else if(stateError == false) {
			$('#modal').find('.modal-title').html('Caracter inválido!');
			$('#modal').find('.modal-body').html('<p>Digite apenas letras de A até Z para validar lexicamente sua palavras.</p>');
			$('#modal').modal('show');
			clearHighlight();
			$('#search_word').val('');
		}
	}
};

const clearHighlight = () => {
	document.querySelectorAll('tr').forEach((line)=>{
		line.classList.remove('focus-linha');
		line.classList.remove('focus-coluna-erro')
	});

	document.querySelectorAll('td').forEach((column) => {	
		column.classList.remove('focus-coluna');
		column.classList.remove('focus-coluna-erro');
	});
}

const createHighlight = (state, word, error) => {
	clearHighlight();
	if(error == '-'){
		$('#tabela_tbody .linha_' + state).addClass('focus-linha-erro');
		$('#tabela_tbody .linha_' + state).addClass('focus-coluna-erro');
		$('#tabela_tbody .coluna_' + word).addClass('focus-coluna-erro');
	} else {
		$('#tabela_tbody .linha_' + state).addClass('focus-linha');
		$('#tabela_tbody .coluna_' + word).addClass('focus-coluna');
	}
};
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
		html = `<span class="dropdown-item addedWord">${word}<span onclick='removeWord("${word}")'>${iconTrashHTML}</span>`;
		$('#input-field').append(html);
		wordArray.push(word);
		$('#input_word').val('');
	} 
	createWordState();
	table = createLinesFromTable();
	createTable(table);
};

const removeWord = word => {
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

const clear = () => {
	$('#tabela_tbody').html('');
	$('#searched_words').html('');
	globalIteration = [0];
	globalState = 0;
	state = [[]];
	table = [];
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

