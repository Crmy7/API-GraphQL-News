<template>
  <div class="bg-white max-w-screen-xl w-full mt-[40px] px-12 py-8 mx-auto">
    <div v-for="post in result.posts" :key="post.id" class="post">
      <div class="flex gap-5">
        <h1 class="text-black text-base font-bold font-['Lexend']">
          {{ post.title }}
        </h1>
        <h2
          class="text-center text-black/30 text-base font-normal font-['Lexend']"
        >
          ({{ post.content }})
        </h2>
      </div>
      <div class="flex gap-5">
        <h3
          class="text-black/60 text-base font-normal font-['Lexend'] underline"
        >
          Par {{ post.author }}
        </h3>

        <h4 class="text-black/60 text-base font-semibold font-['Lexend']">
          {{ formatElapsedTime(post.createdAt) }}
        </h4>

        <h5
          class="text-black/60 text-base font-normal font-['Lexend'] underline"
        >
          {{ post.comments.length }} commentaire{{
            post.comments.length > 1 ? "s" : ""
          }}
        </h5>
      </div>
      <div class="flex flex-col gap-5 mt-5 items-start">
        <input
          v-model="newCommentAuthor"
          class="w-[427px] h-[54.90px] p-3 bg-black/5 rounded-[20px]"
          type="text"
          placeholder="Votre nom"
        />

        <textarea
          v-model="newCommentContent"
          class="w-[427px] h-[150px] p-3 bg-black/5 rounded-[20px]"
          placeholder="Votre commentaire"
        ></textarea>

        <button
          @click="addComment(post.id)"
          class="text-white text-base font-bold font-['Lexend'] px-5 py-2 bg-[#ec6d19] rounded-full"
        >
          Ajouter un commentaire
        </button>
      </div>

      <div v-if="post.comments && post.comments.length" class="mt-12">
        <div v-for="comment in post.comments" :key="comment.id" class="mb-12">
          <div class="flex gap-5">
            <h4 class="text-black/80 text-base font-bold font-['Lexend']">
              {{ comment.author }}
            </h4>
            <h5 class="text-black/60 text-base font-normal font-['Lexend']">
              {{ formatElapsedTime(comment.createdAt) }}
            </h5>
          </div>
          <p class="text-black/70 text-base font-normal font-['Lexend']">
            {{ comment.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { params } = useRoute();

const newCommentAuthor = ref("");
const newCommentContent = ref("");

const query = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author
      createdAt
      comments {
        id
        content
        author
        postId
        createdAt
      }
    }
  }
`;

const addCommentMutation = gql`
  mutation AddComment($postId: ID!, $content: String!, $author: String!) {
    addComment(postId: $postId, content: $content, author: $author) {
      id
      content
      author
      postId
    }
  }
`;

const result = ref({ posts: [] });

const { onResult } = useQuery(query, { id: params.id });

onResult((queryResult) => {
  result.value.posts = [queryResult.data.post];
});

function formatElapsedTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "année", seconds: 31536000 },
    { label: "mois", seconds: 2592000 },
    { label: "jour", seconds: 86400 },
    { label: "heure", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `Il y a ${count} ${interval.label}${count > 1 ? "s" : ""}`;
    }
  }
  return "just now";
}

async function addComment(postId) {
  if (!newCommentAuthor.value || !newCommentContent.value) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const { mutate } = useMutation(addCommentMutation);
    const { data } = await mutate({
      postId: postId,
      content: newCommentContent.value,
      author: newCommentAuthor.value,
    });

    const postIndex = result.value.posts.findIndex((p) => p.id === postId);
    if (postIndex !== -1) {
      const updatedComments = [
        ...result.value.posts[postIndex].comments,
        data.addComment,
      ];
      result.value.posts[postIndex] = {
        ...result.value.posts[postIndex],
        comments: updatedComments,
      };
    }

    newCommentAuthor.value = "";
    newCommentContent.value = "";
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
  }
}
</script>
