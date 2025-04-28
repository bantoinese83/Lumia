import { useCallback } from 'react';
import Select from 'react-select';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import { voiceProfiles, VoiceProfile } from '../../config/voiceProfiles';
import './voice-selector.scss';

const CustomOption = ({ innerProps, label, data }: any) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    if (img.src !== data.fallbackImage) {
      img.src = data.fallbackImage;
    }
  };

  return (
    <div {...innerProps} className="voice-option">
      <img 
        src={data.image} 
        alt={data.label} 
        className="voice-avatar" 
        onError={handleImageError}
      />
      <div className="voice-info">
        <div className="voice-name">{data.value}</div>
        <div className="voice-role">{data.role}</div>
        <div className="voice-company">{data.company}</div>
      </div>
    </div>
  );
}

export default function VoiceSelector() {
  const { config, setConfig } = useLiveAPIContext();

  // Derive selected option from config
  const selectedOption = voiceProfiles.find(
    profile => profile.value === config.generationConfig?.speechConfig?.voiceConfig?.prebuiltVoiceConfig?.voiceName
  ) || voiceProfiles[0];

  const updateConfig = useCallback(
    (voiceName: string) => {
      setConfig({
        ...config,
        generationConfig: {
          ...config.generationConfig,
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName,
              },
            },
          },
        },
      });
    },
    [config, setConfig]
  );

  return (
    <div className="select-group">
      <label htmlFor="voice-selector">Interviewer</label>
      <Select
        id="voice-selector"
        className="react-select"
        classNamePrefix="react-select"
        styles={{
          control: baseStyles => ({
            ...baseStyles,
            background: 'var(--Neutral-15)',
            color: 'var(--Neutral-90)',
            minHeight: '33px',
            maxHeight: '33px',
            border: 0,
          }),
          option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isFocused
              ? 'var(--Neutral-30)'
              : isSelected
                ? 'var(--Neutral-20)'
                : undefined,
            padding: '8px',
          }),
        }}
        value={selectedOption}
        options={voiceProfiles}
        components={{ Option: CustomOption }}
        onChange={e => {
          if (e) {
            updateConfig(e.value);
          }
        }}
      />
    </div>
  );
}
