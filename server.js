const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Rota para receber os dados
app.post('/webhook-trigger', async (req, res) => {
    const { url, type } = req.body;

    // Validação básica
    if (!url || !['amazon', 'shopee'].includes(type)) {
        return res.status(400).json({ error: 'URL ou Type (amazon/shopee) inválidos.' });
    }

    try {
        // O endereço do n8n deve vir de uma variável de ambiente no Easypanel
        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

        if (!N8N_WEBHOOK_URL) {
            return res.status(500).json({ error: 'Configuração do n8n ausente no servidor.' });
        }

        // Enviando para o n8n
        await axios.post(N8N_WEBHOOK_URL, {
            original_url: url,
            store_type: type,
            timestamp: new Date().toISOString(),
            source: 'NodeJS-API'
        });

        return res.status(200).json({ message: 'Dados enviados para o n8n com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar para n8n:', error.message);
        return res.status(500).json({ error: 'Falha ao comunicar com n8n.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));