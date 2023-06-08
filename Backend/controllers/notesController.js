const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// to get all the notes, we need to make get request, the route is gonna be /note and must be private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length)
    return res.status(400).json({ message: "No notes found" });

  try {
    const notesWithUser = await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();
        if (user && user.username) {
          return { ...note, username: user.username };
        } else {
          // Handle the case where the user is not found or doesn't have a username
          return { ...note, username: "Unknown" };
        }
      })
    );
    res.json(notesWithUser);
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// to create a new notes, we need to make post request, the route is gonna be /note and must be private
const createNewNote = async (req, res) => {
  try {
    const { user, title, text } = req.body;

    // Confirm data
    if (!user || !title || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate title
    const duplicateNote = await Note.findOne({ title });
    if (duplicateNote) {
      return res.status(409).json({ message: "Duplicate note title" });
    }

    // Create the new note
    const newNote = new Note({
      user,
      title,
      text,
    });
    const savedNote = await newNote.save();

    if (savedNote) {
      return res
        .status(201)
        .json({ message: "New note added successfully", note: savedNote });
    } else {
      return res.status(500).json({ message: "Failed to save note" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the note" });
  }
};

// to update a note, we need to make patch request, the route is gonna be /note and must be private
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json(`'${updatedNote.title}' updated`);
});

// to delete a note, we need to make delete request, the route is gonna be /note and must be private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const result = await note.deleteOne();

  const reply = `Note '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
