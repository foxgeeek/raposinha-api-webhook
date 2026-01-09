const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/nova-oferta', async (req, res) => {
    try {
        // Pegamos o corpo inteiro da requisição
        const payload = req.body;
        
        // Valida a chave de segurança comparando com a ENV do EasyPanel
        if (!payload.api_key || payload.api_key !== process.env.API_KEY) {
            return res.status(401).json({ erro: 'Chave incorreta' });
        }

        // Agora enviamos o payload INTEIRO (incluindo a api_key) para o n8n
        await axios.post(process.env.N8N_WEBHOOK_URL, payload);

        return res.status(200).json({ status: 'sucesso' });

    } catch (error) {
        console.error('Erro ao enviar:', error.message);
        return res.status(500).json({ erro: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Ativa na porta ${PORT}`));
