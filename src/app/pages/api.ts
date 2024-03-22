import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // URL de base de votre API Java
  timeout: 5000, // Durée maximale d'attente pour une requête en millisecondes
  headers: {
    'Content-Type': 'application/json', // Type de contenu des requêtes
  },
});

// Interface pour représenter les données d'une histoire
interface Story {
    id?: number;
  author: string;
  content: string;
}

// Fonction pour créer une nouvelle histoire
export async function createStory(storyData: Story): Promise<Story> {
  try {
    const response = await axiosInstance.post<Story>('/api/v1/story/postUser', storyData);
    getAllStories();
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Gérer les erreurs de réponse (erreur du serveur)
      console.error('Erreur de réponse:', error.response.data);
      throw new Error('Erreur de création de l\'histoire.');
    } else if (error.request) {
      // Gérer les erreurs de requête (pas de réponse du serveur)
      if (error.code === 'ECONNABORTED') {
        console.error('La requête a expiré:', error.message);
        throw new Error('La requête a expiré. Veuillez réessayer.');
      } else if (error.code === 'ECONNREFUSED') {
        console.error('La connexion au serveur a été refusée:', error.message);
        throw new Error('La connexion au serveur a été refusée. Veuillez vérifier la configuration du serveur.');
      } else {
        console.error('Pas de réponse du serveur:', error.request);
        throw new Error('Pas de réponse du serveur : vérifiez que le serveur est accessible et que CORS est configuré correctement.');
      }
    } else {
      // Gérer les autres erreurs
      console.error('Une erreur s\'est produite:', error.message);
      throw new Error('Une erreur s\'est produite lors de la création de l\'histoire.');
    }
  }
}

export async function getAllStories(): Promise<Story[]> {
  try {
    const response = await axiosInstance.get<Story[]>('/api/v1/story/getStories');
    console.log("data",response.data)
    return response.data;
  } catch (error: any) {
    // Gérer les erreurs
    console.error('Une erreur s\'est produite lors de la récupération des histoires :', error);
    throw new Error('Erreur lors de la récupération des histoires.');
  }
}

export async function updateStory(updatedStoryData: Story): Promise<Story> {
    try {
        console.log("Tentative de mise à jour de l'histoire :", updatedStoryData);
        const response = await axios.put<Story>(`/api/v1/story/updateStory`, updatedStoryData);
        console.log("Réponse de la mise à jour de l'histoire :", response);
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.error("La requête a été annulée :", error);
        } else {
            console.error("Une erreur s'est produite lors de la mise à jour de l'histoire :", error);
        }
        throw new Error("Erreur lors de la mise à jour de l'histoire.");
    }
}

  export async function deleteStory(storyId: number): Promise<void> {
    try {
        // Envoyer la requête DELETE à l'API
        await axiosInstance.delete(`/api/v1/story/deleteStory/${storyId}`);
    } catch (error) {
        // Gérer les erreurs
        console.error('Une erreur s\'est produite lors de la suppression de l\'histoire :', error);
        throw new Error('Erreur lors de la suppression de l\'histoire.');
    }
}

