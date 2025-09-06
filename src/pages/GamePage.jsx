import { useRef, useEffect } from 'react';
import Engine,{
  Rect,
  magnitude,
  normalize,
  Character,
  controllers,
  loadAttachments,
  DEFAULT_ATTACHMENTS,
} from '../engine';
import CharacterSelector from '../components/CharacterSelector';

const GameLogic = ({children}) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const handleStart = async () => {
    if (!canvasRef.current) return;
    if (engineRef.current) return;

    const engine = Engine({
      canvas: canvasRef.current,
      width: 400,
      height: 400,
    });
    engineRef.current = engine;

    if (!engine) return;

    engine.addMap('maps/test.json');

    const storedCharacter = window.localStorage.getItem('character') && JSON.parse(window.localStorage.getItem('character'));
    const attachments = await loadAttachments(storedCharacter);
    console.log(attachments);

    const character = await new Character({
      attachments,
      rect: new Rect(0, 0, 64, 64),
    });

    engine.addCharacter(character);

    engine.addController(new controllers.MouseController((action, data) => {
      if(action === "move") {
        const [x, y] = data;
        const [charX, charY] = character.position;
        const diff = [x - charX, y - charY];
        const distance = magnitude(...diff);
        let direction = [0, 0]
        if (distance > 1) {
          direction = normalize(...diff);
        }
        character.move(...direction);
      }
    }));
    await engine.start();
  }

  useEffect(() => {
    handleStart();
  }, [canvasRef.current]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, pointerEvents: 'none' }}>
          {children}
        </div>
        <canvas 
          ref={canvasRef} 
          style={{ 
            display: 'block',
            margin: '20px auto',
            backgroundColor: 'white',
            border: '1px solid #ccc',
          }}
        />
      </div>
  );
}

function GamePage() {
  return (
    <GameLogic />
  )
}

export default GamePage
