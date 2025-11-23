import Image from "next/image";

const data = [
  {
    id: "1",
    src: "/images/image-1.jpg",
    text:
      "برگزاری باشکوه مراسم دعای عرفه در سراسر کشور با حضور خیل عظیم عاشقان و دلدادگان اهل بیت (ع) و اقامه نماز و قرائت دعای عرفه به صورت همزمان در مساجد و حسینیه‌ها." +
      "\nاین مراسم فرصتی است تا بندگان خدا با تضرع و دعا به درگاه الهی تقرب جویند و از گناهان خویش آمرزش طلب کنند.",
  },
  {
    id: "2",
    src: "/images/image-2.jpg",
    text:
      "برگزاری باشکوه مراسم دعای عرفه در سراسر کشور با حضور خیل عظیم عاشقان و دلدادگان اهل بیت (ع) و اقامه نماز و قرائت دعای عرفه به صورت همزمان در مساجد و حسینیه‌ها." +
      "\nاین مراسم فرصتی است تا بندگان خدا با تضرع و دعا به درگاه الهی تقرب جویند و از گناهان خویش آمرزش طلب کنند.",
  },
  {
    id: "3",
    src: "/images/image-3.jpg",
    text:
      "برگزاری باشکوه مراسم دعای عرفه در سراسر کشور با حضور خیل عظیم عاشقان و دلدادگان اهل بیت (ع) و اقامه نماز و قرائت دعای عرفه به صورت همزمان در مساجد و حسینیه‌ها." +
      "\nاین مراسم فرصتی است تا بندگان خدا با تضرع و دعا به درگاه الهی تقرب جویند و از گناهان خویش آمرزش طلب کنند.",
  },
];

export default function Page({ params }) {
  const { id } = params;
  const news = data.find((item) => item.id === id);

  if (!news) {
    return <p className="text-center my-40">خبر مورد نظر پیدا نشد.</p>;
  }

  return (
    <div className="my-40 mx-5 md:mx-[250px] flex flex-col gap-10">
      <div className="relative w-full h-[300px] md:h-[500px] rounded overflow-hidden">
        <Image src={news.src} alt="news image" fill className="object-cover" />
      </div>
      <div className="text-justify leading-loose whitespace-pre-line">
        {news.text}
      </div>
    </div>
  );
}
