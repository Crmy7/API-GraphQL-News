<template>
  <div class="bg-white max-w-screen-xl w-full mt-10 px-12 py-8 mx-auto">
    <h1 class="text-2xl font-bold text-black mb-6">Ajouter un nouveau post</h1>

    <div class="flex flex-col gap-5">
      <!-- Input pour le titre -->
      <input
        v-model="title"
        class="w-full h-[54.90px] p-3 bg-black/5 rounded-[20px]"
        type="text"
        placeholder="Titre du post"
      />

      <!-- Input pour le contenu -->
      <textarea
        v-model="content"
        class="w-full h-[150px] p-3 bg-black/5 rounded-[20px]"
        placeholder="Contenu du post"
      ></textarea>

      <!-- Input pour l'auteur -->
      <input
        v-model="author"
        class="w-full h-[54.90px] p-3 bg-black/5 rounded-[20px]"
        type="text"
        placeholder="Auteur du post"
      />

      <!-- Bouton de soumission -->
      <button
        @click="createPost"
        class="text-white text-base font-bold px-5 py-2 bg-[#ec6d19] rounded-full"
      >
        Publier
      </button>
    </div>

    <!-- Message de confirmation ou d'erreur -->
    <div v-if="message" class="mt-4 text-center">
      <p :class="messageType === 'success' ? 'text-green-500' : 'text-red-500'">
        {{ message }}
      </p>
      <NuxtLink to="/" class="mt-5 block">
        <span class="underline">Retour à l'accueil</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Mutation GraphQL pour créer un post
const createPostMutation = gql`
  mutation CreatePost($title: String!, $content: String!, $author: String!) {
    createPost(title: $title, content: $content, author: $author) {
      id
      title
      content
      author
      createdAt
    }
  }
`;

// Champs du formulaire
const title = ref("");
const content = ref("");
const author = ref("");
const message = ref("");
const messageType = ref("");

// Fonction pour créer un post
const createPost = async () => {
  if (!title.value || !content.value || !author.value) {
    message.value = "Veuillez remplir tous les champs.";
    messageType.value = "error";
    return;
  }

  try {
    const { mutate } = useMutation(createPostMutation);
    await mutate({
      title: title.value,
      content: content.value,
      author: author.value,
    });

    // Réinitialiser les champs du formulaire et afficher un message de succès
    title.value = "";
    content.value = "";
    author.value = "";
    message.value = "Post créé avec succès !";
    messageType.value = "success";
  } catch (error) {
    console.error("Erreur lors de la création du post :", error);
    message.value = "Une erreur s'est produite lors de la création du post.";
    messageType.value = "error";
  }
};
</script>

<style scoped>
/* Ajoutez des styles personnalisés ici si nécessaire */
</style>
