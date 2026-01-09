const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/nova-oferta', async (req, res) => {
    try {
        const { api_key, ...data } = req.body;
        
        // Valida a chave de segurança
        if (!api_key || api_key !== process.env.API_KEY) {
            return res.status(401).json({ erro: 'Chave incorreta' });
        }

        // Envia apenas os dados da oferta para o n8n
        await axios.post(process.env.N8N_WEBHOOK_URL, data);

        return res.status(200).json({ status: 'sucesso' });

    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Ativa na porta ${PORT}`));
