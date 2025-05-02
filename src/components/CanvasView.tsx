import Konva from 'konva';
import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Group, Image, Text } from 'react-konva';
import useImage from 'use-image';

type Thought = {
  x: number;
  y: number;
  text: string;
};

type ThoughtBubbleProps = {
  x: number;
  y: number;
  text: string;
};

const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({ x, y, text }) => {
  const groupRef = useRef<Konva.Group>(null);
  const [svgImage] = useImage('/cloud.png'); 
  

  const handleMouseEnter = () => {
    if (groupRef.current) {
      groupRef.current.to({
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 0.2,
      });
      groupRef.current.moveToTop();
    }
  };

  const handleDblClick = () => {
    if (groupRef.current) {
      const group = groupRef.current;
      group.to({
        opacity: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 0.5,
        onFinish: () => {
          group.destroy();
          group.getLayer()?.draw();
        },
      });
    }
  };  

  const handleMouseLeave = () => {
    if (groupRef.current) {
      groupRef.current.to({
        scaleX: 1,
        scaleY: 1,
        duration: 0.2,
      });
    }
  };

  return (
    <Group
      x={x}
      y={y}
      ref={groupRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDblClick={handleDblClick}
    >
      
      {svgImage && (
        <Image
        image={svgImage}
        width={200}
        height={200}
        offsetX={100}
        offsetY={100}
      />
      
      )}
      <Text
        text={text}
        fontSize={19}
        fontFamily="Helvetica"
        fontStyle='bold'
        fill="#9d8189"
        width={80}
        height={60}
        align="center"
        verticalAlign="middle"
        offsetX={40}
        offsetY={40}
      />
    </Group>
  );
};

type CanvasViewProps = {
  thoughts: Thought[];
};

const CanvasView: React.FC<CanvasViewProps> = ({ thoughts }) => {
  const layerRef = useRef<any>(null);
  const [logoImage] = useImage('/logo.png');

  useEffect((): void => {
    const layer = layerRef.current;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const bubbleRadius = 150;

    const anim = new Konva.Animation((frame: any) => {
      if (!frame) return;
      const time = frame.time / 1000;

      const nodes = layer.getChildren();

      nodes.forEach((a: any, i: number) => {
        const dx = centerX - a.x();
        const dy = centerY - a.y();
        a.x(a.x() + dx * 0.005);
        a.y(a.y() + dy * 0.005 + Math.sin(time + i) * 0.25);

        nodes.forEach((b: any, j: number) => {
          if (i === j) return;
          const distX = a.x() - b.x();
          const distY = a.y() - b.y();
          const distance = Math.sqrt(distX ** 2 + distY ** 2);
          const minDist = bubbleRadius;

          if (distance < minDist && distance > 0) {
            const repelForce = (minDist - distance) * 0.075;
            a.x(a.x() + (distX / distance) * repelForce);
            a.y(a.y() + (distY / distance) * repelForce);
          }
        });
      });
    }, layer);

    anim.start();
  }, []);

  return (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        draggable
        
      >
        {/* Capa principal con burbujas */}
        <Layer ref={layerRef}>
          {thoughts.map((t, i) => (
            <ThoughtBubble key={i} x={t.x} y={t.y} text={t.text} />
          ))}
        </Layer>
    
        {/* Capa fija para el logo */}
        <Layer listening={false}>
          {logoImage && (
            <Image
              image={logoImage}
              x={20}
              y={20}
              width={80}
              height={80}
            />
          )}
        </Layer>
      </Stage>    
  );
};

export default CanvasView;
