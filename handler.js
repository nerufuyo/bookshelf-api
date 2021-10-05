// Global Variable
const { nanoid } = require('nanoid') 
const books = require('./books') 

// Add Book 
const addBook= (request, handler) => {
    // Variable 
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload 
  
    // Add Book by General
    if (name === undefined) {
        const showResponse = handler.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }) 
        showResponse.code(400) 
    
        return showResponse 
    }
  
    // Add Book if Page Count < Read Page
    if (pageCount < readPage) {
        const showResponse = handler.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }) 
        showResponse.code(400) 
    
        return showResponse 
    }
  
    const id = nanoid(16) 
    const insertedAt = new Date().toISOString() 
    const updatedAt = insertedAt 
    const finished = (pageCount === readPage) 
    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt } 
  
    // Push New Book to Array Book 
    books.push(newBook) 
  
    // Condition when Pushing Book 
    const isSuccess = books.filter((book) => book.id === id).length > 0 
    if (isSuccess) {
        const showResponse = handler.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
            bookId: id,
            },
        }) 
        showResponse.code(201) 
    
        return showResponse 
    } else {
        const showResponse = handler.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
          }) 
          showResponse.code(500) 
        
          return showResponse 
    }
} 
  
// Get All Book 
const getAllBooks = (request, handler) => {
    const { name, reading, finished } = request.query 
    let selectionBooks = books 
  
    if (name !== undefined) {
        selectionBooks = selectionBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())) 
    }
  
    if (reading !== undefined) {
        selectionBooks = selectionBooks.filter((book) => book.reading === !!Number(reading)) 
    }
  
    if (finished !== undefined) {
        selectionBooks = selectionBooks.filter((book) => book.finished === !!Number(finished)) 
    }
  
    const showResponse = handler.response({
      status: 'success',
      data: {
        books: selectionBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }) 
    showResponse.code(200) 
  
    return showResponse 
} 
  
// Get Book Id 
const getBookById = (request, handler) => {
    const { id } = request.params 
    const book = books.filter((b) => b.id === id)[0] 
  
    // Search Book by Id 
    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      } 
    }
  
    // Failed Search Book by Id 
    const showResponse = handler.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }) 
    showResponse.code(404) 
  
    return showResponse 
} 
  
// Edit Book by Id 
const editBookById = (request, handler) => {
    const { id } = request.params 
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload 
    const updatedAt = new Date().toISOString() 
    const index = books.findIndex((book) => book.id === id) 
  
    if (index !== -1) {
        // Failed Edit Book cause Did Not Enter The Book Name 
      if (name === undefined) {
        const showResponse = handler.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }) 
        showResponse.code(400) 
  
        return showResponse 
      }
  
    //   Failed Edit Book cause Read Page More Than Page Count 
      if (pageCount < readPage) {
        const showResponse = handler.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }) 
        showResponse.code(400) 
  
        return showResponse 
      }
  
      const finished = (pageCount === readPage) 
  
      books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt } 
  
      const showResponse = handler.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      }) 
      showResponse.code(200) 
  
      return showResponse 
    }
  
    // Failed Edit Book cause Failed Search Book Id 
    const showResponse = handler.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }) 
    showResponse.code(404) 
  
    return showResponse 
} 
  
// Delete Book by Id 
const deleteBookById = (request, handler) => {
    const { id } = request.params 
  
    const index = books.findIndex((note) => note.id === id) 
  
    if (index !== -1) {
      books.splice(index, 1) 
      const showResponse = handler.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      }) 
      showResponse.code(200) 
  
      return showResponse 
    }
  
    const response = handler.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }) 
    showResponse.code(404) 
  
    return showResponse 
} 
  
module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    editBookById,
    deleteBookById,
} 
  