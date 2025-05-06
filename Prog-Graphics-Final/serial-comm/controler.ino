const int FIRE_PIN = 13;
const int FLIP_PIN = 12;
const int UP_PIN = 4;
const int DOWN_PIN = 7;
bool up = false;
bool down = false;
bool _FIRE = false;
bool _FLIP = false;
bool prevFIRE = false;
bool prevFLIP = false;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(FIRE_PIN, INPUT);
  pinMode(FLIP_PIN, INPUT);
  pinMode(UP_PIN, OUTPUT);
  pinMode(DOWN_PIN, OUTPUT);
}

void loop() {
   _FIRE = digitalRead(FIRE_PIN);
   _FLIP = digitalRead(FLIP_PIN);

  if(Serial.available() > 0) {
    String msg = Serial.readStringUntil('\n');
    if (msg == "UP"){
      up = true;
    }
    if (msg == "DOWN"){
      down = true;
    }
  }
  
  if (_FIRE == 1 && prevFIRE != _FIRE){
    Serial.println("FIRE ");
    }
  if (_FLIP == 1 && prevFLIP != _FLIP){
    Serial.println("FLIP ");
    }

  if (up) {
    up = false;
    digitalWrite(UP_PIN, HIGH);
    Serial.println("UP ON");
  }
  else {digitalWrite(UP_PIN, LOW);}

  if (down) {
    down = false;
    digitalWrite(DOWN_PIN, HIGH);
    Serial.println("DOWN ON");
  }
  else {digitalWrite(DOWN_PIN, LOW);}

 prevFIRE = _FIRE;
 prevFLIP = _FLIP;

  delay(2);
}