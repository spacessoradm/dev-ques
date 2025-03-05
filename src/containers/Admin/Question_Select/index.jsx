import React, { useState, useEffect } from "react";
import Select from "react-select";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import supabase from "../../../config/supabaseClient";

const QuestionSequenceEditor = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [initialSequence, setInitialSequence] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from("questions").select("id, question_text");
      if (error) console.error("Error fetching question:", error);
      else setQuestions(data);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchSequence = async () => {
      const { data, error } = await supabase
        .from("tbl_sequence")
        .select("sequence")
        .eq("category", "demoQ")
        .single();

      if (error) {
        console.error("Error fetching sequence:", error);
      } else if (data) {
        setInitialSequence(data.sequence || []);
        setSelectedQuestions(
          data.sequence.map((item) => ({
            id: item.id,
            question_text: questions.find((v) => v.id === item.id)?.question_text || "Unknown",
            position: item.position,
          }))
        );
      }
    };

    if (questions.length > 0) fetchSequence();
  }, [questions]);

  const handleSelectChange = (selectedOptions) => {
    const newSelected = selectedOptions.map((option, index) => ({
      id: option.value,
      question_text: option.label,
      position: index + 1,
    }));

    setSelectedQuestions(newSelected);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = selectedQuestions.findIndex((item) => item.id === active.id);
    const newIndex = selectedQuestions.findIndex((item) => item.id === over.id);
    const newList = arrayMove(selectedQuestions, oldIndex, newIndex).map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setSelectedQuestions(newList);
  };

  const handleSave = async () => {
    const orderedData = selectedQuestions.map(({ id, position }) => ({ id, position }));
    const category = "demoQ";

    const { error } = await supabase.from("tbl_sequence").upsert([
      { category, sequence: orderedData },
    ], { onConflict: ["category"] });

    if (error) console.error("Error saving sequence:", error);
    else alert("Saved!");
  };

  return (
    <div>
      <h2>Question Editor</h2>

      <Select
        options={questions.map((question) => ({ value: question.id, label: question.question_text }))}
        isMulti
        onChange={handleSelectChange}
        placeholder="Select question..."
        value={selectedQuestions.map((v) => ({ value: v.id, label: v.question_text }))}
      />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={selectedQuestions.map((v) => v.id)} strategy={verticalListSortingStrategy}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {selectedQuestions.map((question) => (
              <SortableItem key={question.id} question={question} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        Save
      </button>
    </div>
  );
};

const SortableItem = ({ question }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });

  const style = {
    padding: "10px",
    margin: "5px 0",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <strong>{question.position}.</strong> {question.question_text}
    </li>
  );
};

export default QuestionSequenceEditor;
