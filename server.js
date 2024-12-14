const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Configurar middleware para processar JSON
app.use(express.json());

// Função para ler arquivos JSON dentro das pastas
const getEstagioData = (escola, curso) => {
    const estagioPath = path.join(__dirname, 'escolas', escola, curso, 'estagio.json');
    try {
        const data = require(estagioPath);
        return data;
    } catch (err) {
        return null;
    }
};

// Rota inicial
app.get('/', (req, res) => {
    res.send('Bem-vindo à API das Escolas!');
});


// Lista de escolas com IDs
const escolas = [
    { id: 1, nome: 'ESTG' },
    { id: 2, nome: 'ESE' },
    { id: 3, nome: 'ESEA' },
    { id: 4, nome: 'ESCE' },
    { id: 5, nome: 'ESDL' },
    { id: 6, nome: 'ESS' }
];

// Rota para obter todas as escolas
app.get('/api/escolas', (req, res) => {
    res.json(escolas);
});

// Rota para obter uma escola pelo ID
app.get('/api/escolas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // Converter o id para número
    const escola = escolas.find(e => e.id === id); // Encontrar a escola pelo ID

    if (!escola) {
        return res.status(404).json({ error: 'Escola não encontrada' }); // Retornar erro 404 se não encontrado
    }

    res.json(escola); // Retornar a escola encontrada
});




// Rota para obter todos os cursos de uma escola específica
app.get('/api/escolas/:escola/cursos', (req, res) => {
    const escola = req.params.escola.toUpperCase();
    const cursosPath = path.join(__dirname, 'escolas', escola);
    
    // Lê os diretórios dentro de "escolas" para encontrar cursos
    const cursos = [];
    try {
        const cursoDirs = fs.readdirSync(cursosPath, { withFileTypes: true });
        cursoDirs.forEach(dirent => {
            if (dirent.isDirectory()) {
                cursos.push(dirent.name);
            }
        });
        res.json(cursos);
    } catch (err) {
        res.status(404).json({ mensagem: 'Escola não encontrada.' });
    }
});

// Rota para obter informações de um curso específico de uma escola
app.get('/api/escolas/:escola/cursos/:curso', (req, res) => {
    const escola = req.params.escola.toUpperCase();
    const curso = req.params.curso;
    const estagioData = getEstagioData(escola, curso);

    if (!estagioData) {
        return res.status(404).json({ mensagem: 'Curso não encontrado.' });
    }

    res.json(estagioData);
});

// Rota para obter informações sobre estágios de um curso específico
app.get('/api/escolas/:escola/cursos/:curso/estagios', (req, res) => {
    const escola = req.params.escola.toUpperCase();
    const curso = req.params.curso;
    const estagioData = getEstagioData(escola, curso);

    if (!estagioData) {
        return res.status(404).json({ mensagem: 'Estágio não encontrado para o curso.' });
    }

    res.json(estagioData.estagios);
});

// Porta do servidor
const PORT = 3000;

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
