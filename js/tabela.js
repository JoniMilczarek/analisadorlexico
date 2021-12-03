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