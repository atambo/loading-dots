import { useEffect, useState } from "react";
import { Animated } from "react-native";
import { useLoadingContext } from "./context";
import { Dot } from "./dot";
import { animationStyle } from "./animation-style";

const Container = (): JSX.Element => {
  const { animation, dots, size, delay } = useLoadingContext();

  const animatedValues = (animation: string | undefined) => {
    switch (animation) {
      case "pulse":
        return Number(0);
      case "elastic":
        return Number(1);
      case "flashing":
        return Number(size);
      case "typing":
        return Number(0);
      case "ping":
        return Number(1);
      default:
        return Number(0);
    }
  };
  const list = Array.from(
    Array(dots),
    () => new Animated.Value(animatedValues(animation))
  );
  const [isMounted, setIsMounted] = useState(true);

  const run = (nodes: Animated.Value[]) => {
    Animated.parallel(
      nodes.map((node, index) =>
        animationStyle(
          animation,
          node,
          delay ? index * delay : index * 260,
          size
        )
      )
    ).start(() => {
      if (isMounted) {
        run(nodes);
      }
    });
  };

  useEffect(() => {
    run(list);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <Animated.View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {list.map((size, index) => (
        <Dot key={index} dynamicSize={size} />
      ))}
    </Animated.View>
  );
};

export { Container };
