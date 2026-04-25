const { Schema, model } = require('mongoose');

const QuestionSchema = new Schema(
    {
        topic: { type: String, required: true },
        shortDescription: { type: String, required: true },
        longDescription: { type: String, required: true },
        tags: { type: [String], default: [] },
        mainCategory: {type: String, required: true},
        references: { type: [String], default: [] }
    },
    { timestamps: true }
);

module.exports = model('Question', QuestionSchema);
