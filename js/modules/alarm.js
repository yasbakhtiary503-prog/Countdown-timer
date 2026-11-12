const alarmAudioEl = document.getElementById("alarm-sound");

export const playAlarm = () => {
  alarmAudioEl.currentTime = 0;

  alarmAudioEl.play().catch((error) => {
    console.error("Could not play alarm:", error);
  });
};

export const stopAlarm = () => {
  alarmAudioEl.pause();
  alarmAudioEl.currentTime = 0;
};
