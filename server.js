const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Rota simplificada: Recebe qualquer coisa e envia para o n8n
app.post('/webhook-trigger', async (req, res) => {
    try {
        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

        if (!N8N_WEBHOOK_URL) {
            console.error('ERRO: Variável N8N_WEBHOOK_URL não definida.');
            return res.status(500).json({ error: 'Configuração pendente no servidor.' });
        }

        // Repassa o body inteiro recebido + um timestamp
        const dataToN8n = {
            ...req.body,
            received_at: new Date().toISOString()
        };

        // Envia para o n8n
        await axios.post(N8N_WEBHOOK_URL, dataToN8n);

        return res.status(200).json({ 
            success: true, 
            message: 'Enviado ao n8n' 
        });

    } catch (error) {
        console.error('Erro ao repassar para n8n:', error.message);
        return res.status(500).json({ 
            error: 'Falha ao comunicar com n8n',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
