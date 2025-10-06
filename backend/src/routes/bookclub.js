export default async function bookclubRoutes(fastify) {
  const prisma = fastify.prisma;

  // GET latest 6 books with cover images for carousel
  fastify.get("/carousel", async (req, reply) => {
    try {
      const latestBooks = await prisma.book.findMany({
        where: {
          coverImage: {
            not: null,
          },
        },
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
          publishedYear: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return {
        success: true,
        data: latestBooks,
        count: latestBooks.length,
        message:
          latestBooks.length > 0
            ? `Found ${latestBooks.length} books with cover images`
            : "No books with cover images found",
      };
    } catch (err) {
      reply.code(500).send({
        success: false,
        message: "Failed to fetch carousel books",
        error: err.message,
      });
    }
  });

  // Helper function to shuffle array
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // GET recommended books (shuffled, 6 books) - using include
  fastify.get("/recommended", async (req, reply) => {
    try {
      // Get all books with cover images
      const allBooks = await prisma.book.findMany({
        where: {
          coverImage: {
            not: null,
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Shuffle the books array
      const shuffledBooks = shuffleArray([...allBooks]);

      // Take first 6 books
      const recommendedBooks = shuffledBooks.slice(0, 6);

      return {
        success: true,
        data: recommendedBooks,
        count: recommendedBooks.length,
        message: `Found ${recommendedBooks.length} recommended books`,
      };
    } catch (err) {
      reply.code(500).send({
        success: false,
        message: "Failed to fetch recommended books",
        error: err.message,
      });
    }
  });

  // GET search books and authors
  fastify.get("/search", async (req, reply) => {
    try {
      const { q: query, type = "all", limit = 10 } = req.query;

      if (!query || query.length < 2) {
        return reply.code(400).send({
          success: false,
          message: "Search query must be at least 2 characters long",
        });
      }

      let results = [];

      if (type === "all" || type === "book") {
        const books = await prisma.book.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          take: parseInt(limit),
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        results = [
          ...results,
          ...books.map((book) => ({
            type: "book",
            id: book.id,
            title: book.title,
            author: book.author.name,
            description: book.description,
            coverImage: book.coverImage,
            publishedYear: book.publishedYear,
            category: "Book",
          })),
        ];
      }

      if (type === "all" || type === "author") {
        const authors = await prisma.author.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { bio: { contains: query, mode: "insensitive" } },
            ],
          },
          take: parseInt(limit),
          select: {
            id: true,
            name: true,
            bio: true,
            image: true,
          },
        });

        results = [
          ...results,
          ...authors.map((author) => ({
            type: "author",
            id: author.id,
            title: author.name,
            author: author.name,
            description: author.bio,
            coverImage: author.image,
            category: "Author",
          })),
        ];
      }

      // Sort by relevance (simple title match priority)
      results.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
        const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        return 0;
      });

      return {
        success: true,
        data: results.slice(0, parseInt(limit)),
        count: results.length,
        query,
        type,
      };
    } catch (err) {
      reply.code(500).send({
        success: false,
        message: "Failed to perform search",
        error: err.message,
      });
    }
  });

  // GET books by author
  fastify.get("/booksbyauthor", async (req, reply) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search;
      const authorId = req.query.author;
      const year = req.query.year;
      const sort = req.query.sort || "newest";

      // Build where clause
      let where = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { author: { name: { contains: search, mode: "insensitive" } } },
        ];
      }

      if (authorId && authorId !== "all") {
        where.authorId = parseInt(authorId);
      }

      if (year && year !== "all") {
        where.publishedYear = parseInt(year);
      }

      // Build orderBy clause
      let orderBy = {};
      switch (sort) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "title_asc":
          orderBy = { title: "asc" };
          break;
        case "title_desc":
          orderBy = { title: "desc" };
          break;
        default: // 'newest'
          orderBy = { createdAt: "desc" };
      }

      const [totalBooks, books] = await Promise.all([
        prisma.book.count({ where }),
        prisma.book.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalBooks / limit);

      return {
        page,
        limit,
        totalBooks,
        totalPages,
        data: books,
        filters: { search, authorId, year, sort },
      };
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });
}
