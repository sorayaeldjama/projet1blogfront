'use client'
import { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { createStory, deleteStory, getAllStories, updateStory } from "./pages/api"; // Importez la fonction createStory depuis votre fichier api.ts
import axios from "axios";
import React from "react";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const [author, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [updateAuthor, setUpdateAuthor] = useState<string>("");
  const [updateContent, setUpdateContent] = useState<string>("");
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);

  const [selectedStoryId, setSelectedStoryId] = useState<number>();


  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = (storyId: number) => { setIsUpdateOpen(true); setOpen(true); setSelectedStoryId(storyId) };
  const handleClose = () => setOpen(false);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      console.log("je suis dans le try")
      // Envoi des données à l'API
      const newStory = await createStory({ author, content });
      console.log("Nouvelle histoire créée :", newStory);
      const updatedStories = [...stories, newStory]; // Ajoutez la nouvelle histoire à la liste actuelle des histoires
      setStories(updatedStories as any)
      // Réinitialisation des champs du formulaire après la soumission
      // setTitle("");
      // setContent("");
    } catch (error) {
      console.error("Une erreur s'est produite lors de la création de l'histoire :", error);
    }
  };
  interface Story {
    id: number;
    author: string;
    content: string;
    // Autres propriétés de l'histoire...
  }
  const [stories, setStories] = useState<Story[]>([]);
  useEffect(() => {
    async function fetchStories() {
      try {
        // Appel de la fonction pour récupérer toutes les histoires
        const fetchedStories = await getAllStories();
        // Mettre à jour l'état avec les histoires récupérées
        setStories(fetchedStories as any);
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des histoires :', error);
      }
    }

    fetchStories(); // Appel de la fonction lors du premier rendu
  }, []); // Effectuer cet effet une seule fois après le premier rendu

  const handleDelete = async (storyId: number) => {
    try {
      await deleteStory(storyId);
      setStories(stories.filter(story => story.id !== storyId)); // Filtrer l'histoire supprimée de l'état des histoires
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de l'histoire :", error);
    }
  };
  const handleUpdate = async () => {
    try {
      if (selectedStoryId !== null) {
        await updateStory({ id: selectedStoryId, author: updateAuthor, content: updateContent });
        const updatedStories = stories.map(story => {
          if (story.id === selectedStoryId) {
            return { ...story, author: updateAuthor, content: updateContent };
          }
          return story;
        });
        setStories(updatedStories);
        handleClose();
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la mise à jour de l'histoire :", error);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Typography sx={{ marginBottom: 4, fontWeight: "bold" }}>Create a story :</Typography>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, width: "500", alignItems: "flex-start", justifyContent: "flex-start" }}>
        <TextField
          id="title"
          label="Author"
          variant="outlined"
          value={author}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="content"
          label="Content"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" variant="contained">Create Story</Button>
      </form>
      <br></br>
      <Typography sx={{ marginBottom: 4, fontWeight: "bold" }}>      All Stories :
      </Typography>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
          <ul>
            {stories.map((story, index) => (

              <li key={index}>
                <h2>{story.author}</h2>
                <p>{story.content}</p>
                <Button type="submit" sx={{ marginRight: 2 }} variant="contained"
                  onClick={() => handleOpen(story.id)}                >
                  Update Story</Button>
                <Button color="error" type="submit" variant="contained" onClick={() => handleDelete(story.id)}>Delete Story</Button>
                {
                  isUpdateOpen && (
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Update Story              </Typography>
                        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 8, width: "500", alignItems: "flex-start", justifyContent: "flex-start" }}>
                          <TextField
                            id="id"
                            type="hidden"
                            defaultValue={selectedStoryId}
                          />
                          <TextField
                            id="title"
                            label="Author"
                            variant="outlined"
                            value={updateAuthor}
                            onChange={(e) => setUpdateAuthor(e.target.value)}
                          />
                          <TextField
                            id="content"
                            label="Content"
                            variant="outlined"
                            value={updateContent}
                            onChange={(e) => setUpdateContent(e.target.value)}
                          />

                          <Button type="submit" variant="contained" >Update Story</Button>
                        </form>
                      </Box>
                    </Modal>
                  )
                }
              </li>
            ))}
          </ul>
        </div>
      </main>


    </main>
  );
}
function uodateStory(storyId: number) {
  throw new Error("Function not implemented.");
}

