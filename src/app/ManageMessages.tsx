"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form";
import { addMessage, deleteMessage } from "./action";

type Message = {
  id: string;
  content: string;
  optimisticId?: string;
  deleting?: boolean;
};

export function ManageMessages() {
  const form = useForm({
    defaultValues: {
      messages: [] as Message[],
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "messages",
    keyName: `rhfId`
  });

  const addItem = () => {
    const newItem = {
      id: ``,
      content: `New Message ${fields.length}`,
      optimisticId: crypto.randomUUID(),
    };
    append(newItem);
    return newItem;
  };

  const updateAddedItem = (dataFromServer: Message) => {
    const idx = form
      .getValues()
      .messages.findIndex(m => m.optimisticId === dataFromServer.optimisticId);
    if (idx === -1) {
      console.log(``)
      return
    };
    update(idx, dataFromServer);
  };

  // const undoAddItem = (optimisticId: string) => {
  //   const idx = form
  //     .getValues()
  //     .messages.findIndex(m => m.optimisticId === optimisticId);
  //   const msg = form
  //     .getValues()
  //     .messages.find(m => m.optimisticId === optimisticId);
  //   if (idx === -1 || !msg) return;
  //   update(idx, msg);
  // };

  const removeItem = (id: string) => {
    const idx = form.getValues().messages.findIndex(m => m.id === id);
    const msg = form.getValues().messages.find(m => m.id === id);
    if (idx === -1 || !msg) {
      console.log(`idx or msg not found`, idx, msg, id)
      return
    };
    update(idx, { ...msg, deleting: true });
  };

  const updateRemovedItem = (id: string) => {
    const idx = form.getValues().messages.findIndex(m => m.id === id);
    if (idx === -1) return;
    remove(idx);
  };

  // const undoRemoveItem = (id: string) => {
  //   const idx = form.getValues().messages.findIndex(m => m.id === id);
  //   const msg = form.getValues().messages.find(m => m.id === id);
  //   if (idx === -1 || !msg) return;
  //   update(idx, { ...msg, deleting: undefined });
  // };

  return (
    <main>
      <AnimatePresence initial={false}>
        {fields.filter(msg => !msg.deleting).map(msg => {
          return (
            <motion.div
              key={msg.optimisticId ?? msg.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 100, height: `auto` }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div>{msg.content}</div>
              <small>key: {msg.id ? msg.id : `(${msg.optimisticId})`}</small>
              <button
                onClick={async () => {
                  removeItem(msg.id);
                  await deleteMessage({ id: msg.id });
                  updateRemovedItem(msg.id);
                }}
              >
                Delete
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <button
        onClick={async () => {
          const newItem = addItem();
          const updatedItem = await addMessage(newItem);
          updateAddedItem(updatedItem);
        }}
      >
        Add New Message
      </button>
    </main>
  );
}
