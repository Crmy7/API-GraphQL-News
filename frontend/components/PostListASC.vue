<template>
    <div>
      <div
        class="w-full flex items-center justify-center flex-col pt-32 max-w-screen-xl mx-auto"
      >
        <div class="flex w-full justify-end items-center pb-5">
          <NuxtLink
            to="/post/new"
            class="px-7 py-2 h-fit bg-[#EC6D19] rounded-[44px] text-center text-white text-base font-bold font-['Lexend'] cursor-pointer"
          >
            Ajouter un post
          </NuxtLink>
        </div>
  
        <!-- Affichage des posts uniquement si les données sont prêtes -->
        <div
          v-if="result && result.posts && result.posts.length > 0"
          class="flex flex-col items-center justify-center gap-5 w-full"
        >
          <div
            v-for="post in result.posts"
            :key="post.id"
            class="w-full flex justify-center"
          >
            <div class="flex relative w-full bg-white px-16 py-9">
              <NuxtLink :to="'/post/' + post.id" class="flex flex-col w-4/5">
                <div class="flex gap-5 items-center">
                  <div class="text-black text-base font-bold font-['Lexend']">
                    {{ post.title }}
                  </div>
                  <div
                    class="text-black/30 text-base font-normal font-['Lexend']"
                  >
                    {{ post.content }}
                  </div>
                </div>
                <div class="flex gap-5 items-center">
                  <div
                    class="text-black/60 text-base font-normal font-['Lexend']"
                  >
                    Par {{ post.author }}
                  </div>
                  <div
                    class="text-black/60 text-base font-semibold font-['Lexend']"
                  >
                    Publié il y a {{ calculateTime(post.createdAt) }}
                  </div>
                  <div
                    class="text-black/60 text-base font-normal font-['Lexend'] underline"
                  >
                    Voir les commentaires
                  </div>
                </div>
              </NuxtLink>
              <div class="w-1/5">
                <button
                  @click.prevent="deletePost(post.id)"
                  class="px-7 py-2 h-fit bg-[#ff4141] rounded-[44px] text-center text-white text-base font-bold font-['Lexend'] cursor-pointer"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- État de chargement ou message d'absence de données -->
        <div v-else class="text-center text-black">
          <p v-if="loading">Chargement des posts...</p>
          <p v-else>Pas de posts disponibles.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Importations nécessaires
  import { onMounted, ref } from "vue";
  import { useQuery, useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  
  // Requête GraphQL pour récupérer les posts triés par date de création décroissante
  const query = gql`
    query GetPosts($orderBy: String, $order: String) {
      posts(orderBy: $orderBy, order: $order) {
        id
        title
        content
        author
        createdAt
      }
    }
  `;
  
  const deletePostMutation = gql`
    mutation DeletePost($id: ID!) {
      deletePost(id: $id)
    }
  `;
  
  const posts = ref([]);
  const loading = ref(true);
  
  const { result, onResult, refetch } = useQuery(query, {
    orderBy: "createdAt",
    order: "ASC",
  });
  
  // Mettre à jour les posts lors de la réception des données
  onResult((queryResult) => {
    posts.value = queryResult.data.posts;
    loading.value = false;
  });
  
  // Recharger les posts chaque fois que le composant est monté
  onMounted(async () => {
    loading.value = true;
    await refetch();
    loading.value = false;
  });
  
  // Fonction pour supprimer un post
  const deletePost = async (postId) => {
    try {
      const { mutate } = useMutation(deletePostMutation, {
        variables: { id: postId },
      });
  
      const { error, data } = await mutate();
  
      if (error) {
        console.error("Erreur lors de la suppression :", error);
      } else if (data?.deletePost) {
        await refetch(); // Recharger les posts après suppression
      } else {
        console.error("Échec de la suppression du post.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
  
  // Fonction pour calculer le temps écoulé
  const calculateTime = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);
  
    const diff = currentDate - postDate;
    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInDays > 0) {
      return `${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
    } else if (diffInHours > 0) {
      return `${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
    } else {
      return `${diffInSeconds} seconde${diffInSeconds > 1 ? "s" : ""}`;
    }
  };
  </script>
  