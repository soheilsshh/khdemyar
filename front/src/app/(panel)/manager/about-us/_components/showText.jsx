"use client";
import React, { useState, useEffect } from "react";

function ShowText() {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    setText(
      "چایخانه حضرت رضا علیه السلام که برگرفته از صحن و سرای حرم مطهر امام رضا علیه السلام می باشد بدین صورت شکل گرفت که در ابتدای به امر بعد از ارتباط با آستان قدس رضوی و آشنایی با چگونگی و نحوه ساخت مجموعه ، تصمیم به ایجاد چایخانه حضرت رضا علیه السلام در غالب مجموعه فرهنگی مذهبی گرفته شد. از مورخ 6 مرداد 1400 مصادف با عید غدیر آغاز به کار گردید . که طی مشارکت شهرداری شاهرود ظرف مدت 10 روز کاری احداث گردید . سازه توسط شهرداری شاهرود آماده گردید و به کمک اعضا تجهیز و راه اندازی شد."
    );
  }, []);
  return (
    <div>
      {editing ? (
        <textarea
          className="w-full h-[400px] rounded bg-white p-4"
          defaultValue={text}
          onChange={(e) => e.currentTarget.value}
          onBlur={() => {
            setEditing(false);
          }}
          autoFocus
        ></textarea>
      ) : (
        <p className="text-black" onClick={setEditing(true)}>
          {text || "در حال برگزاری"}
        </p>
      )}
    </div>
  );
}

export default ShowText;
