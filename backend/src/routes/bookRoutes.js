import fs from "fs";
import path from "path";

export default async function bookRoutes(fastify) {
  const prisma = fastify.prisma;

  // 1️⃣ GET books with pagination (include author)
  fastify.get("/", async (req, reply) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalBooks = await prisma.book.count();

      const books = await prisma.book.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        include: { author: true },
      });

      const totalPages = Math.ceil(totalBooks / limit);

      return { page, limit, totalBooks, totalPages, data: books };
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });

  // 2️⃣ GET all books (no pagination)
  fastify.get("/list", async (req, reply) => {
    try {
      const books = await prisma.book.findMany({
        orderBy: { id: "asc" },
        include: { author: true },
      });
      return books;
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });

  // 3️⃣ GET single book (with author)
  fastify.get("/:id", async (req, reply) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return reply.code(400).send({ message: "Invalid book ID" });

    try {
      const book = await prisma.book.findUnique({
        where: { id },
        include: { author: true },
      });
      if (!book) return reply.code(404).send({ message: "Book not found" });
      return book;
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });

  // 4️⃣ POST new book (with PDF and cover image upload)
  fastify.post("/", async (req, reply) => {
    try {
      let title = "";
      let description = "";
      let publishedYear = null;
      let authorId = null;
      let pdfPath = null;
      let coverImagePath = null;

      if (req.isMultipart()) {
        for await (const part of req.parts()) {
          if (part.file) {
            // Handle file uploads
            const uploadDir = path.join(process.cwd(), "uploads/books");
            if (!fs.existsSync(uploadDir))
              fs.mkdirSync(uploadDir, { recursive: true });

            const filename = `${Date.now()}-${part.filename}`;
            const filepath = path.join(uploadDir, filename);

            const writeStream = fs.createWriteStream(filepath);
            await part.file.pipe(writeStream);

            // Determine if it's PDF or cover image based on fieldname
            if (part.fieldname === "pdf") {
              pdfPath = `/uploads/books/${filename}`;
            } else if (part.fieldname === "coverImage") {
              coverImagePath = `/uploads/books/${filename}`;
            }
          } else {
            // Handle text fields
            if (part.fieldname === "title") title = part.value;
            if (part.fieldname === "description") description = part.value;
            if (part.fieldname === "publishedYear")
              publishedYear = parseInt(part.value, 10);
            if (part.fieldname === "authorId")
              authorId = parseInt(part.value, 10);
          }
        }
      } else {
        const { title: t, description: d, publishedYear: y, authorId: a, pdf, coverImage } =
          req.body;
        title = t;
        description = d;
        publishedYear = y;
        authorId = a;
        pdfPath = pdf ?? null;
        coverImagePath = coverImage ?? null;
      }

      if (!title || !authorId)
        return reply.code(400).send({ message: "Title and authorId required" });

      const book = await prisma.book.create({
        data: {
          title,
          description,
          publishedYear,
          authorId,
          pdf: pdfPath,
          coverImage: coverImagePath,
        },
        include: { author: true },
      });

      reply.code(201).send(book);
    } catch (err) {
      reply.code(500).send({ message: err.message });
    }
  });

  // 5️⃣ PUT update book (with optional PDF and cover image upload)
  fastify.put("/:id", async (req, reply) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return reply.code(400).send({ message: "Invalid book ID" });

    try {
      // First, get the current book to handle file deletion if needed
      const currentBook = await prisma.book.findUnique({ where: { id } });
      if (!currentBook) {
        return reply.code(404).send({ message: "Book not found" });
      }

      let title, description, publishedYear, authorId, pdfPath, coverImagePath;

      if (req.isMultipart()) {
        for await (const part of req.parts()) {
          if (part.file) {
            const uploadDir = path.join(process.cwd(), "uploads/books");
            if (!fs.existsSync(uploadDir))
              fs.mkdirSync(uploadDir, { recursive: true });

            const filename = `${Date.now()}-${part.filename}`;
            const filepath = path.join(uploadDir, filename);

            const writeStream = fs.createWriteStream(filepath);
            await part.file.pipe(writeStream);

            // Determine file type and delete old file if exists
            if (part.fieldname === "pdf") {
              // Delete old PDF file if exists
              if (currentBook.pdf) {
                const oldPdfPath = path.join(process.cwd(), currentBook.pdf);
                if (fs.existsSync(oldPdfPath)) {
                  fs.unlinkSync(oldPdfPath);
                }
              }
              pdfPath = `/uploads/books/${filename}`;
            } else if (part.fieldname === "coverImage") {
              // Delete old cover image if exists
              if (currentBook.coverImage) {
                const oldCoverPath = path.join(process.cwd(), currentBook.coverImage);
                if (fs.existsSync(oldCoverPath)) {
                  fs.unlinkSync(oldCoverPath);
                }
              }
              coverImagePath = `/uploads/books/${filename}`;
            }
          } else {
            if (part.fieldname === "title") title = part.value;
            if (part.fieldname === "description") description = part.value;
            if (part.fieldname === "publishedYear")
              publishedYear = parseInt(part.value, 10);
            if (part.fieldname === "authorId")
              authorId = parseInt(part.value, 10);
          }
        }
      } else {
        ({ title, description, publishedYear, authorId, pdf: pdfPath, coverImage: coverImagePath } =
          req.body);
      }

      const data = {};
      if (title) data.title = title;
      if (description) data.description = description;
      if (publishedYear) data.publishedYear = publishedYear;
      if (authorId) data.authorId = authorId;
      if (pdfPath) data.pdf = pdfPath;
      if (coverImagePath) data.coverImage = coverImagePath;

      const updated = await prisma.book.update({
        where: { id },
        data,
        include: { author: true },
      });

      return updated;
    } catch (err) {
      reply.code(404).send({ message: "Error: " + err.message });
    }
  });

  // 6️⃣ DELETE book (with file cleanup)
  fastify.delete("/:id", async (req, reply) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return reply.code(400).send({ message: "Invalid book ID" });

    try {
      // Get book first to delete associated files
      const book = await prisma.book.findUnique({ where: { id } });
      if (!book) {
        return reply.code(404).send({ message: "Book not found" });
      }

      // Delete PDF file if exists
      if (book.pdf) {
        const pdfPath = path.join(process.cwd(), book.pdf);
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }
      }

      // Delete cover image if exists
      if (book.coverImage) {
        const coverPath = path.join(process.cwd(), book.coverImage);
        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(coverPath);
        }
      }

      // Delete book from database
      await prisma.book.delete({ where: { id } });
      
      return { message: "Book deleted successfully" };
    } catch (err) {
      reply.code(404).send({ message: "Book not found" });
    }
  });
}