const { Post, Comment } = require("../models/index");

const resolvers = {
  Query: {
    // Récupérer tous les posts avec tri et inclusion des commentaires
    posts: async (_, { orderBy = 'createdAt', order = 'ASC' }) => {
      return await Post.findAll({
        include: { model: Comment, as: 'comments' },
        order: [[orderBy, order]], // Tri dynamique basé sur les arguments
      });
    },

    // Récupérer un post par son ID avec les commentaires associés
    post: async (_, { id }) => {
      return await Post.findByPk(id, {
        include: { model: Comment, as: 'comments' },
      });
    },
  },

  Mutation: {
    // Créer un nouveau post
    createPost: async (_, { title, content, author }) => {
      return await Post.create({ title, content, author });
    },

    // Ajouter un commentaire à un post
    addComment: async (_, { postId, content, author }) => {
      const post = await Post.findByPk(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      return await Comment.create({ content, author, postId });
    },

    // Supprimer un post (et ses commentaires)
    deletePost: async (_, { id }) => {
      if (!id) {
        throw new Error("Post ID not specified");
      }

      const post = await Post.findByPk(id);
      if (!post) {
        throw new Error("Post not found");
      }

      // Supprimez les commentaires liés au post
      await Comment.destroy({ where: { postId: id } });

      // Supprimez le post
      await post.destroy();

      return true;
    },
  },

  Post: {
    // Resolver pour inclure les commentaires d'un post
    comments: async (post) => {
      return await Comment.findAll({
        where: { postId: post.id },
        attributes: ['id', 'content', 'author', 'postId', 'createdAt'],
      });
    },
  },
};

module.exports = resolvers;
