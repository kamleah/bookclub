export default async function dashboardRoutes(fastify) {
  const prisma = fastify.prisma;

  // GET dashboard statistics
  fastify.get("/stats", async (req, reply) => {
    try {
      const currentYear = new Date().getFullYear();
      
      // Get all counts in parallel
      const [
        totalBooks,
        totalAuthors,
        booksThisYear
      ] = await Promise.all([
        // Total books count
        prisma.book.count(),
        
        // Total authors count
        prisma.author.count(),
        
        // Books published this year
        prisma.book.count({
          where: {
            publishedYear: currentYear
          }
        })
      ]);

      // Calculate library collection (books + authors)
      const libraryCollection = totalBooks + totalAuthors;

      return {
        totalBooks,
        totalAuthors,
        booksThisYear,
        libraryCollection,
        lastUpdated: new Date().toISOString()
      };
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });
}