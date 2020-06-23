const Note = require('../../models/note')

module.exports = {
  notes: (args, req) => { 
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    return Note.find({creator: req.userId})
    .then(notes => {
      return notes.map(note => {
        return {...note._doc,
          _id: note.id,
          createdAt: note.createdAt
        }
      })
    }).catch(err => console.log(err))
  },
  updateNote: async ({id, title, category, text}, req) => {
    if (!req.isAuth) {
     throw new Error('Unauthenticated!')
    }
    let note = await Note.findById(id);
    if (!note) {
      throw new Error("Note not found");
    }
    // update with new values
    note.title = title || note.title;
    note.category = category || note.category;
    note.text = text || todo.text;
    return note.save()
    .then (
      result => {
        let updatedNote = {...result._doc};
        return updatedNote;
      }
    )
    .catch(err => {
      throw new Error("could_not_update_note", err);;
    })
  },
  createNote: (args, req) => { 
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    const note = new Note({
      title: args.noteInput.title,
      category: args.noteInput.category,
      text: args.noteInput.text,
      creator: req.userId
    });
    return note.save()
    .then(result => {
      return {...result._doc,
        _id: result.id,
        creator: result._doc.creator };
    })
    .catch(err => console.log(err));
  },
  deleteNote: async (args, req) => {
    if (!req.isAuth) {
     throw new Error('Unauthenticated!')
    }
    try {
      const deletedNote = await Note.findByIdAndDelete(args.noteId).populate('note');
      if (!deletedNote) {
        throw new Error("note_delete_not_found")
      }
      return deletedNote._id;
    } catch(err) {
      throw err; 
    }
  }
}