import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const WaterMelon = () => {
  const canvasRef = useRef(null);
  let ball;

  useEffect(() => {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Body = Matter.Body,
      Bodies = Matter.Bodies,
      Events = Matter.Events,
      Composite = Matter.Composite;

    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 480,
        height: 720,
        wireframes: false,
      },
    });

    const times = [];
    const parent = document.getElementById('parent');
    //const floor = document.getElementById("floor");

    let fps = 100;

    let mousePos;
    let isClicking = false;
    let isMouseOver = false;
    let newSize = 1;

    let isGameOver = false;
    let score = 0;

    let isLineEnable = false;

    const background = Bodies.rectangle(240, 360, 480, 720, {
        isStatic: true,
        render: { fillStyle: "#fe9" },
      });
      background.collisionFilter = {
        group: 0,
        category: 1,
        mask: -2,
      };
      const ground = Bodies.rectangle(400, 1215, 810, 1000, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      });
      const wallLeft = Bodies.rectangle(-50, 500, 100, 1000, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      });
      const wallRight = Bodies.rectangle(530, 500, 100, 1000, {
        isStatic: true,
        render: { fillStyle: "transparent" },
      });
      
    World.add(engine.world, [wallLeft, wallRight, ground, background]);
    // 엔진 실행
    Engine.run(engine);
    // 렌더러 실행
    Render.run(render);

    init();

    canvasRef.current.addEventListener("mousedown", () => {
      if (isGameOver) return;
  
      isClicking = isMouseOver;
    });
    canvasRef.current.addEventListener("touchstart", (e) => {
      if (isGameOver) return;
  
      isClicking = true;
      //mousePos = e.touches[0].clientX / parent.style.zoom;
    });
  
    canvasRef.current.addEventListener("mouseup", () => {
      if (isGameOver) return;
  
      isClicking = false;
    });
    canvasRef.current.addEventListener("touchend", () => {
      if (isGameOver) return;
  
      isClicking = false;
  
      if (isGameOver) return;
  
      if (ball != null) {
        ball.createdAt = 0;
        ball.collisionFilter = {
          group: 0,
          category: 1,
          mask: -1,
        };
        Body.setVelocity(ball, { x: 0, y: (100 / fps) * 5.5 });
        ball = null;
  
        newSize = Math.ceil(Math.random() * 3);
  
        setTimeout(() => createNewBall(newSize), 500);
      }
    });
  
    canvasRef.current.addEventListener("mousemove", (e) => {
      if (isGameOver) return;
  
      const rect = canvasRef.current.getBoundingClientRect();
      //mousePos = e.clientX / parent.style.zoom - rect.left;
    });
    canvasRef.current.addEventListener("touchmove", (e) => {
      if (isGameOver) return;
  
      const rect = canvasRef.current.getBoundingClientRect();
      //mousePos = e.touches[0].clientX / parent.style.zoom - rect.left;
    });

    canvasRef.current.addEventListener("click", () => {
        if (isGameOver || !isMouseOver) return;
    
        if (ball != null) {
          ball.createdAt = 0;
          ball.collisionFilter = {
            group: 0,
            category: 1,
            mask: -1,
          };
          Body.setVelocity(ball, { x: 0, y: (100 / fps) * 5.5 });
          ball = null;
    
          newSize = Math.ceil(Math.random() * 3);
    
          setTimeout(() => createNewBall(newSize), 500);
        }
      });
    
      canvasRef.current.addEventListener("mouseover", () => {
        isMouseOver = true;
      });
    
      canvasRef.current.addEventListener("mouseout", () => {
        isMouseOver = false;
      });    

      function resize() {
        canvasRef.current.height = 720;
        canvasRef.current.width = 480;
    
        // if (isMobile()) {
        //   parent.style.zoom = window.innerWidth / 480;
        //   parent.style.top = "0px";
    
        // //   floor.style.height = `${
        // //     (window.innerHeight - canvasRef.current.height * parent.style.zoom) /
        // //     parent.style.zoom
        // //   }px`;
        // } else {
        //   parent.style.zoom = window.innerHeight / 720 / 1.3;
        //   parent.style.top = `${(canvasRef.current.height * parent.style.zoom) / 15}px`;
    
        //   //floor.style.height = "50px";
        // }
    
        // Render.setPixelRatio(render, parent.style.zoom * 2);
      }
    
      function refreshLoop() {
        window.requestAnimationFrame(() => {
          const now = performance.now();
          while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
          }
          times.push(now);
          fps = times.length;
          refreshLoop();
        });
      }
    
      function isMobile() {
        return window.innerHeight / window.innerWidth >= 1.49;
      }      

    function init() {
      // ball 변수를 useRef의 current에 할당
      ball = null;
      engine.timing.timeScale = 1;

      while (engine.world.bodies.length > 4) {
        engine.world.bodies.pop();
      }

      createNewBall(1);
    }

    function createNewBall(size) {
      // ball 변수를 useRef의 current에 할당
      ball = newBall(render.options.width / 2, 50, size);
      ball.collisionFilter = {
        group: -1,
        category: 2,
        mask: 0,
      };

      Matter.World.add(engine.world, ball);
    }

    function newBall(x, y, size) {
      let c = Matter.Bodies.circle(x, y, size * 10, {
        render: {
            sprite: {
                texture: process.env.PUBLIC_URL + '/assets/img/0.png',
                xScale: size / 12.75,
                yScale: size / 12.75,
              },
        },
      });
      c.size = size;
      c.createdAt = Date.now();
      c.restitution = 0.3;
      c.friction = 0.1;

      return c;
    }

    function gameOver() {
        isGameOver = true;
        engine.timing.timeScale = 0;
    
        //gameOverlayer.style.display = "";
    
        if (ball != null) World.remove(engine.world, ball);
      }

    Events.on(engine, "beforeUpdate", () => {
        if (isGameOver) return;
    
        if (ball != null) {
          const gravity = engine.world.gravity;
          Body.applyForce(ball, ball.position, {
            x: -gravity.x * gravity.scale * ball.mass,
            y: -gravity.y * gravity.scale * ball.mass,
          });
    
          if (isClicking && mousePos !== undefined) {
            ball.position.x = mousePos;
    
            if (mousePos > 455) ball.position.x = 455;
            else if (mousePos < 25) ball.position.x = 25;
          }
    
          ball.position.y = 50;
        }
    
        isLineEnable = false;
        const bodies = Composite.allBodies(engine.world);
        for (let i = 4; i < bodies.length; i++) {
          let body = bodies[i];
    
          if (body.position.y < 100) {
            if (
              body !== ball &&
              Math.abs(body.velocity.x) < 0.2 &&
              Math.abs(body.velocity.y) < 0.2
            ) {
              gameOver();
            }
          } else if (body.position.y < 150) {
            if (
              body !== ball &&
              Math.abs(body.velocity.x) < 0.5 &&
              Math.abs(body.velocity.y) < 0.5
            ) {
              isLineEnable = true;
            }
          }
        }
      });

    Events.on(engine, "collisionActive", collisionEvent);
    Events.on(engine, "collisionStart", collisionEvent);
 
    function collisionEvent(e) {
        e.pairs.forEach((collision) => {
          let bodies = [collision.bodyA, collision.bodyB];
    
          if (bodies[0].size === undefined || bodies[1].size === undefined) return;
    
          if (bodies[0].size === bodies[1].size) {
            let allBodies = Composite.allBodies(engine.world);
            if (allBodies.includes(bodies[0]) && allBodies.includes(bodies[1])) {
              if (
                (Date.now() - bodies[0].createdAt < 100 ||
                  Date.now() - bodies[1].createdAt < 100) &&
                bodies[0].createdAt !== 0 &&
                bodies[1].createdAt !== 0
              ) {
                return;
              }
    
              World.remove(engine.world, bodies[0]);
              World.remove(engine.world, bodies[1]);
    
              World.add(
                engine.world,
                newBall(
                  (bodies[0].position.x + bodies[1].position.x) / 2,
                  (bodies[0].position.y + bodies[1].position.y) / 2,
                  bodies[0].size === 11 ? 11 : bodies[0].size + 1
                )
              );
    
              //var audio = new Audio("assets/pop.wav");
              //audio.play();
            }
          }
        });
      }

    // Your Matter.js setup code here

    // Make sure to clean up the engine and renderer when the component unmounts
    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} width={480} height={720}></canvas>
    </div>
  );
};

export default WaterMelon;