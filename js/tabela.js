const montaTabela = itemTab => {
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

const validaPalavra = () => {
	var palavras = ($('#buscar_palavras').val()).toLowerCase();
	
	if(palavras.length == 0){
		$('#tabela_tbody tr').removeClass('focus-linha');
		$('#tabela_tbody td').removeClass('focus-coluna');
	}
	var estado = 0;
	var erroEstado = false;
	
	for(var i=0; i<palavras.length; i++) {
		var exprRegular = /([a-z_])/;
		if(exprRegular.test(palavras[i]) && erroEstado == false){
			highlightTabela(estado, palavras[i], Tabela[estado][palavras[i]]);
			
			if(Tabela[estado][palavras[i]] != '-'){ // se o estado não for de erro, ele aceita
				estado = Tabela[estado][palavras[i]];
			} else { // Rejeita caso o estado seja de erro
				erroEstado = true;
			}
		} else if(palavras[i] == ' '){
			var plvrEncontrada = `<span class='right'><i class="far fa-check-circle"></i></span>`;
			var plvrNaoEncontrada = `<span class='right'><i class="fas fa-minus-circle"></i></span>`;
			
			if (erroEstado == false) {
				if (Tabela[estado]['final']) { //Se o estado for final da Encontrado, se não da Estado não final
					$('#palavras_encontradas').append(`<a class="dropdown-item" href="#">${palavras}</a>`);
					alert("palavra encontrada");
				} else {
					alert("palavra não final");
				}
			} else {
				alert("palavra não encontrada");
			}
			$('#tabela_tbody tr').removeClass('focus-linha');
			$('#tabela_tbody td').removeClass('focus-coluna');
			$('#buscar_palavras').val('');
		} else if(erroEstado == false) {
			alert("Apenas caracteres válidos");
		}
	}
};

const highlightTabela = (estado, palavra, erroEstado) => {
	$('#tabela_tbody tr').removeClass('focus-linha');
	$('#tabela_tbody td').removeClass('focus-coluna');
	$('#tabela_tbody tr').removeClass('focus-linha-erro');
	$('#tabela_tbody td').removeClass('focus-coluna-erro');
	$('#tabela_tbody .linha_' + estado).addClass('focus-linha');
	$('#tabela_tbody .coluna_' + palavra).addClass('focus-coluna');
	if(erroEstado == '-'){
		$('#tabela_tbody .linha_' + estado).addClass('focus-coluna-erro');
		$('#tabela_tbody .coluna_' + palavra).addClass('focus-coluna-erro');
	}
};