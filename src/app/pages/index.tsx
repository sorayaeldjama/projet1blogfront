import axios from 'axios';

// Fonction pour récupérer des données depuis l'API Java
async function fetchDataFromJavaAPI() {
    try {
        const response = await axios.get('http://localhost:8080/votre-endpoint');
        // Traitement de la réponse ici
        console.log(response.data);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données : ', error);
    }
}

// Appel de la fonction pour récupérer des données
fetchDataFromJavaAPI();
