import React, { 
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import body from '../assets/icons/body.png';
import hair from '../assets/icons/hair.png';
import eyes from '../assets/icons/eyes.png';
import shirt from '../assets/icons/shirt.png';
import beard from '../assets/icons/beard.png';
import pants from '../assets/icons/pants.png';
import shoes from '../assets/icons/shoes.png';
import dress from '../assets/icons/dress.png';
import makeup from '../assets/icons/makeup.png';
import {spriteTypes} from '../assets/sprites';
import {LOCAL, LOCAL_LIST} from '../engine';
import './CharacterSelector.css';
import {
  Rect,
  Sprite,
  Texture,
  Renderer,
  Character,
  SpriteSheet,
  AssetManager,
  loadAttachments,
  DEFAULT_ATTACHMENTS,
} from '../engine';

const TYPE_ICONS = Object.freeze({
  [LOCAL.BODY]: body,
  [LOCAL.HAIR]: hair,
  [LOCAL.EYES]: eyes,
  [LOCAL.SHIRT]: shirt,
  [LOCAL.BEARD]: beard,
  [LOCAL.PANTS]: pants,
  [LOCAL.SHOES]: shoes,
  [LOCAL.DRESS]: dress,
  [LOCAL.MAKEUP]: makeup,
});

const ParameterSelectorButton = ({onClick, children, disabled}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ 
        padding: "0",
        width: "2rem",
        height: "2rem",
        display: "flex",
        fontSize: "1rem",
        fontWeight: "bold",
        lineHeight: "1rem",
        alignItems: "center", 
        justifyContent: "center",
        border: "1px solid #ccc",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  )
}

const ParameterSelector = ({type, min=-1, value=min, onChange}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const spriteList = useMemo(() => spriteTypes[type], [type]);

  const maxValue = useMemo(() => spriteList.length - 1, [spriteList]);
  const minValue = useMemo(() => min, [min]);

  const isMin = useMemo(() => currentValue === minValue, [currentValue, minValue]);
  const isMax = useMemo(() => currentValue === maxValue, [currentValue, maxValue]);

  const handleChange = useCallback((type, value) => {
    if (value > maxValue) {
      value = maxValue;
    }
    if (value < minValue) {
      value = minValue;
    }
    setCurrentValue(value);
  }, [maxValue, minValue]);

  useEffect(() => {
    handleChange(type, value);
  }, [value, type]);

  const loadSprite = useCallback((value) => {
    const sprite = spriteList[value];
    if (!sprite) {
      onChange(type, null);
      return;
    }
    const texture = AssetManager.load(sprite.texture, Texture);
    const spriteData = {
      type: sprite.type,
      name: sprite.name,
      variant: 0,
      texture,
    };
    onChange(type, spriteData);
  }, [spriteList, type]);

  useEffect(() => {
    loadSprite(currentValue);
  }, [loadSprite, currentValue]);
  
  return (
    <div 
      style={{ 
        gap: ".6rem",
        padding: ".6rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ParameterSelectorButton onClick={() => handleChange(type, currentValue - 1)} disabled={isMin}>-</ParameterSelectorButton>
      <img src={TYPE_ICONS[type]} alt={type} style={{ width: "2rem", height: "2rem" }} />
      <ParameterSelectorButton onClick={() => handleChange(type, currentValue + 1)} disabled={isMax}>+</ParameterSelectorButton>
    </div>
  )
}

const CharacterPreviewer = ({character, width=100, height=200}) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const [sprites, setSprites] = useState({});

  const handleStart = async () => {
    if (!canvasRef.current) return;
    if (rendererRef.current) return;

    const renderer = new Renderer({
      canvas: canvasRef.current,
      width,
      height,
    });
    rendererRef.current = renderer;

    if (!renderer) return;

    await renderer.start();
  }

  useEffect(() => {
    if(!rendererRef.current) return;
    for (const type in character) {
      const selected_attachment = character[type];
      const updatingTexture = selected_attachment?.texture;
      if(!sprites[type]) {
        const newSprite = new SpriteSheet(updatingTexture, new Rect(0, 0, 128, 128));
        rendererRef.current.addSprite(newSprite);
        setSprites((prev) => ({ ...prev, [type]: newSprite }));
        continue;
      }
      const sprite = sprites[type];
      sprite.texture = updatingTexture;
    }
  }, [rendererRef.current, character, sprites]);

  useEffect(() => {
    handleStart();
  }, [canvasRef.current]);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef} 
      style={{ 
        display: 'block',
        padding: '20px',
      }}
    />
  );
}

const CharacterSelector = ({setPage}) => {
  const [character, setCharacter] = useState(DEFAULT_ATTACHMENTS);

  const loadCharacter = useCallback(async (character) => {
    const loadedAttachments = await loadAttachments(character);
    setCharacter(loadedAttachments);
  }, []);

  useEffect(() => {
    const storedCharacter = window.localStorage.getItem('character');
    if (storedCharacter) {
      loadCharacter(JSON.parse(storedCharacter));
    }
  }, [loadCharacter]);

  const handleSpriteSelect = useCallback((type, value) => {
    if (!value) {
      setCharacter((prev) => ({ ...prev, [type]: null}));
      return;
    }

    const spriteData = {
      variant: 0,
      local: type,
      name: value.name,
      texture: value.texture,
    };

    setCharacter((prev) => ({ ...prev, [type]: spriteData}));
  }, []);

  const handleSave = useCallback(() => {
    console.log(character);
    window.localStorage.setItem('character', JSON.stringify(character));
    //setPage('game');
  }, [character, setPage]);

  return (
    <div className="character-selector">
      <h1>Character Generator</h1>
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <ParameterSelector type="body" min={0} onChange={handleSpriteSelect} />
          <ParameterSelector type="hair" onChange={handleSpriteSelect} />
          <ParameterSelector type="eyes" onChange={handleSpriteSelect} />
          <ParameterSelector type="shirt" onChange={handleSpriteSelect} />
        </div>
        <CharacterPreviewer character={character} width={100} height={200} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <ParameterSelector type="beard" onChange={handleSpriteSelect} />
          <ParameterSelector type="pants" onChange={handleSpriteSelect} />
          <ParameterSelector type="shoes" onChange={handleSpriteSelect} />
          <ParameterSelector type="dress" onChange={handleSpriteSelect} />
          <ParameterSelector type="makeup" onChange={handleSpriteSelect} />
        </div>
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default CharacterSelector;