import Image from "next/image";

const images = [
  {
    id: "1",
    src: "/images/image-1.jpg",
    text: "برگذاری نشست بین خادمیاران چایخانه امام رضا",
  },
  {
    id: "2",
    src: "/images/image-2.jpg",
    text: "برگذاری نشست بین خادمیاران چایخانه امام رضا",
  },
  {
    id: "3",
    src: "/images/image-3.jpg",
    text: "برگذاری نشست بین خادمیاران چایخانه امام رضا",
  },
];

export default function Page({ params }) {
  const { id } = params;
  const gallery = images.find((item) => item.id === id);

  if (!gallery) {
    return <p className="text-center my-40"> عکس مورد نظر پیدا نشد.</p>;
  }

  return (
    <div className="my-40 mx-5 md:mx-[250px] flex flex-col gap-10">
      <div className="relative w-full h-[300px] md:h-[500px] rounded overflow-hidden">
        <Image
          src={gallery.src}
          alt="news image"
          fill
          className="object-cover"
        />
      </div>
      <div className="text-justify leading-loose whitespace-pre-line">
        {gallery.text}
      </div>
    </div>
  );
}
