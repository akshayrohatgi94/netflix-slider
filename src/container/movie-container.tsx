import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import MovieTile from "../component/movie";
import "./movie-container.css";

export default function MovieContainer({ movies }) {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  const margin = 48;
  const containerStyle = { margin: `16px ${margin}px` };

  const [containerState, setContainerState] = useState({
    length: 0,
    activeIndex: 0,
    activeMovies: [],
    direction: 0,
    containerWidth: 0,
    translationPerc: 0,
    initialTranslation: true,
    animationInProgress: false
  });

  const shiftTilesLeft = useCallback(() => shiftTiles(1), [
    containerState.containerWidth,
    containerState.activeIndex
  ]);
  const shiftTilesRight = useCallback(() => shiftTiles(-1), [
    containerState.containerWidth,
    containerState.activeIndex
  ]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    if (containerState.activeIndex === 0) {
      sliderRef.current.style.transform = `translateX(0%)`;
      return;
    }

    sliderRef.current.style.transform = `translateX(-${(containerState.initialTranslation
      ? 0
      : containerState.translationPerc) +
      100 * containerState.direction * -1}%)`;
  }, [sliderRef, containerState.activeIndex, containerState.length]);

  useEffect(() => {
    if (
      containerState.activeIndex !== 0 &&
      !containerState.animationInProgress
    ) {
      sliderRef.current.style.transform = `translateX(-${
        containerState.translationPerc
      }%)
      `;
    }
  }, [containerState.animationInProgress, containerState.translationPerc]);

  const toggleAnimation = useCallback(() => {
    sliderRef.current.classList.remove("animating");
    setContainerState(prevState => ({
      ...prevState,
      animationInProgress: false,
      activeMovies: getActiveMovies(prevState)
    }));
  }, [sliderRef]);

  const handleResize = () => {
    containerSizeChanged(
      (containerRef.current as HTMLElement).getBoundingClientRect().width
    );
  };

  const shiftTiles = direction => {
    sliderRef.current.classList.add("animating");

    setContainerState(prevState => ({
      ...prevState,
      activeIndex: prevState.activeIndex + prevState.length * direction * -1,
      direction,
      initialTranslation: prevState.activeIndex === 0,
      animationInProgress: true
    }));
  };

  const containerSizeChanged = useCallback(
    width => {
      width += margin * 2;
      let num = 0;
      if (width < 500) {
        num = 2;
      } else if (width >= 500 && width < 800) {
        num = 3;
      } else if (width >= 800 && width < 1100) {
        num = 4;
      } else if (width >= 1100 && width < 1400) {
        num = 5;
      } else {
        num = 6;
      }

      setContainerState(prevState => {
        const newState = {
          ...prevState,
          length: num,
          containerWidth: width,
          translationPerc: getTranslatedPerc(num)
        };

        return { ...newState, activeMovies: getActiveMovies(newState) };
      });
    },
    [containerState.containerWidth]
  );

  const getActiveMovies = state => {
    const { length: tilesToShow, activeIndex: activeTileIndex } = state;

    const left = [];
    const mid = [];
    const right = [];

    // fill left
    if (activeTileIndex !== 0) {
      left.push(
        movies.slice(activeTileIndex - tilesToShow, activeTileIndex + 1)
      );
    }

    // fill mid
    mid.push(movies.slice(activeTileIndex, activeTileIndex + tilesToShow));

    // fill right
    if (activeTileIndex + tilesToShow < movies.length - 1) {
      const start = activeTileIndex + tilesToShow;
      const end = activeTileIndex + 2 * tilesToShow + 1;
      right.push(
        movies.slice(start, end > movies.length ? movies.length : end)
      );
    }

    return [...left, ...mid, ...right];
  };

  const getTranslatedPerc = tilesCount => 100 + 100 / tilesCount;

  const prevButton =
    containerState.activeIndex !== 0 ? (
      <a className="slider-button prev" onClick={shiftTilesLeft}>
        {"<"}
      </a>
    ) : null;

  const nextButton =
    containerState.activeIndex + containerState.length < movies.length - 1 ? (
      <a className="slider-button next" onClick={shiftTilesRight}>
        {">"}
      </a>
    ) : null;

  return (
    <div style={containerStyle} ref={containerRef} className="container">
      {prevButton}
      <div onTransitionEnd={toggleAnimation} ref={sliderRef} className="slider">
        {containerState.activeMovies}
      </div>
      {nextButton}
    </div>
  );
}
