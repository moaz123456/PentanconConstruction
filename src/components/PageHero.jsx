export default function PageHero({ title, text, image }) {
  return (
    <section className={`page-hero ${image ? 'page-hero--image' : ''}`.trim()}>
      {image && <img className="page-hero__image" src={image} alt="" />}
      <div className="container page-hero__inner">
        <h1 className="page-hero__title">
          <span className="slash slash--lg" aria-hidden="true" />
          {title}
        </h1>
        {text && <p className="page-hero__text">{text}</p>}
      </div>
    </section>
  );
}
