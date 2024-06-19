//Exercício 03
function setInformacoes() {
    const enderecoJSON = localStorage.getItem('objetoAluno');

    if (enderecoJSON) {
        // Converter a string JSON de volta para um objeto
        const objeto = JSON.parse(enderecoJSON);

        let nome = objeto.nome;
        let idade = objeto.idade;
        let serie = objeto.serie;
        let escola = objeto.escola;
        let materiaFav = objeto.materiaFavorita;


        let informacoesAlunoDiv = document.getElementById('informacoesAluno');
        informacoesAlunoDiv.innerHTML = `
        <h4>Informações do Aluno</h4>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Idade:</strong> ${idade} anos</p>
        <p><strong>Série:</strong> ${serie}</p>
        <p><strong>Escola:</strong> ${escola}</p>
        <p><strong>Matéria Favorita:</strong> ${materiaFav}</p>
        `;

    } else {
        alert("Os dados não foram confirmados. Por favor, preencha as informações novamente.")
        // window.location.href = 'http://127.0.0.1:5500/form.html'
    }
}

function maiorNumero(listaNumeros) {
    let maiorNumero = -Infinity

    for (let i = 0; i < listaNumeros.length; i++) {
        if (listaNumeros[i] > maiorNumero) {
            maiorNumero = listaNumeros[i]
        }
    }
    return maiorNumero;
}


function calcularMediaListaNumeros(listaNumeros) {
    let soma = 0;

    for (numero of listaNumeros) {
        soma += numero;
    }
    // Calcular a média
    let media = soma / listaNumeros.length;
    return media;
}



function submitForm(event) {
    event.preventDefault();
    let boletin = [];
    const boletinJSON = localStorage.getItem('boletin');
    if (boletinJSON) {
        // Converter a string JSON de volta para um objeto
      boletin = JSON.parse(boletinJSON);
    }


    var materia = document.getElementById('materia').value;
    let notas = []


    for (valueInput of document.getElementsByClassName('notas')) {
        notas.push(parseFloat(valueInput.value));
    }
    boletin.push({ materia: materia, notas: notas })

    localStorage.setItem('boletin', JSON.stringify(boletin));

    printNotasAluno()

}

if (document.getElementById('form-notas-materia')) {
    document.getElementById('form-notas-materia').addEventListener('submit', this.submitForm)
}

if (document.getElementById('formulario-aluno')) {
    document.getElementById('formulario-aluno').addEventListener('submit', this.submitFormAluno)
}



function submitFormAluno(event) {
    event.preventDefault();

    let objeto = {};

    objeto.nome = document.forms['formulario-aluno'].nome.value
    objeto.idade = document.forms['formulario-aluno'].idade.value
    objeto.serie = document.forms['formulario-aluno'].serie.value
    objeto.escola = document.forms['formulario-aluno'].escola.value
    objeto.materiaFavorita = document.forms['formulario-aluno'].materiaFavorita.value
    objeto.cep = document.forms['formulario-aluno'].cep.value
    objeto.rua = document.forms['formulario-aluno'].rua.value
    objeto.cidade = document.forms['formulario-aluno'].cidade.value
    objeto.estado = document.forms['formulario-aluno'].estado.value


    const objetoJSON = JSON.stringify(objeto);

    localStorage.setItem('objetoAluno', objetoJSON);


    window.location.href = 'http://127.0.0.1:5500/'
}



async function callApiViaCep() {
    let cep = document.forms['formulario-aluno'].cep.value
    endereco = await apiViaCep(cep)
    console.log(endereco)
    if (endereco.success == false) {
        alert(endereco.mensagem)
        document.forms['formulario-aluno'].cep.value = '';
        return;
    }
    document.forms['formulario-aluno'].rua.value = endereco.logradouro
    document.forms['formulario-aluno'].cidade.value = endereco.localidade
    document.forms['formulario-aluno'].estado.value = endereco.uf

}


async function apiViaCep(cep) {
    try {
        let url = "https://viacep.com.br/ws/" + cep + "/json/";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:5500'
            }
        });
        const endereco = await response.json();
        if (endereco.erro) {
            throw new Error("Cep invalido")
        }
        endereco.success = true;
        return endereco
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return { 'success': false, 'mensagem': error }
    }

}



function printNotasAluno() {

    let boletin = [];
    const boletinJSON = localStorage.getItem('boletin');
    if (boletinJSON) {
        // Converter a string JSON de volta para um objeto
        boletin = JSON.parse(boletinJSON);
    } 
    let medias = [];
    document.getElementById('notasTabela').innerHTML = '';


    for (materia of boletin) {
        var mediaNumerica = calcularMediaListaNumeros(materia.notas)
        medias.push(mediaNumerica)
        var media = mediaNumerica.toFixed(1);



        var newRow = '<tr>' +
            '<td>' + materia.materia + '</td>';

        for (let nota of materia.notas) {
            newRow += '<td>' + nota + '</td>';
        }

        newRow += '<td>' + media + '</td></tr>';


        document.getElementById('notasTabela').innerHTML += newRow;
        document.getElementById('closeModal').click()
        document.getElementById('form-notas-materia').reset();

        let mediaGeral = document.getElementById('mediaGeralAluno');
        mediaGeral.innerText = 'A média geral do aluno é: ' + calcularMediaListaNumeros(medias).toFixed(1);

        let maiorMedia = maiorNumero(medias)
        document.getElementById('maiorMedia').innerHTML = maiorMedia
    }
}


async function carregarAlunos() {
    try {
        
        const response = await fetch('fakeServer/alunos.json');
        
      debugger
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        
        const alunos = await response.json();
        
        
        const listaAlunos = document.getElementById('lista-alunos');

        
        alunos.forEach(aluno => {
            const li = document.createElement('li');
            li.textContent = aluno.nome;
            listaAlunos.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }

}

//Exercício 02
window.addEventListener('load', function (event) {
    if (window.location.pathname == '/' || window.location.pathname == '/index.html') {
        setInformacoes()
        printNotasAluno()
        carregarAlunos()
    }

});
