const int analogInPin = A0;
const int ledPin = 2;


int sensorValue = 0;
int outputValue = 0;
int ledON = 0;

bool sendingOutput = false;

void setup() {
  // initialize serial communications at 9600 bps:
  pinMode(ledPin, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  sensorValue = analogRead(analogInPin);
  //outputValue = map(sensorValue, 0, 1023, 0, 255);

  while (Serial.available() > 0) {
    int ledOn = Serial.parseInt();

    if (Serial.read() == '\n') {
      ledOn = constrain(ledOn, 0, 255);

      digitalWrite(ledPin, ledOn);

      Serial.print(ledOn);
    }
  }
  Serial.print("Serial Input: ");
  Serial.println(sensorValue);
  
  // if (sensorValue >= 1000){
  //   digitalWrite(ledPin, 255);
  // }

  delay(10);
}
