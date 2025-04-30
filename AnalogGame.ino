/*
  Analog input, analog output, serial output

  Reads an analog input pin, maps the result to a range from 0 to 255 and uses
  the result to set the pulse width modulation (PWM) of an output pin.
  Also prints the results to the Serial Monitor.

  The circuit:
  - potentiometer connected to analog pin 0.
    Center pin of the potentiometer goes to the analog pin.
    side pins of the potentiometer go to +5V and ground
  - LED connected from digital pin 9 to ground through 220 ohm resistor

  created 29 Dec. 2008
  modified 9 Apr 2012
  by Tom Igoe

  This example code is in the public domain.

  https://docs.arduino.cc/built-in-examples/analog/AnalogInOutSerial/
*/

// These constants won't change. They're used to give names to the pins used:
const int analogInPin = A0;  // Analog input pin that the potentiometer is attached to
const int analogOutPin = 9;  // Analog output pin that the LED is attached to

const int redPlrPin = 13;
const int bluPlrPin = 12;

const int redWinLED = 2;
const int bluWinLED = 4;

int redButOut = 0;
int bluButOut = 0;

bool redPlrWin = false;
bool bluPlrWin = false;

int sensorValue = 0;  // value read from the pot
int outputValue = 0;  // value output to the PWM (analog out)

int findValue = 0;
int findValueHigh = 255;
int findValueLow = 0;

bool isValueFound = false;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600);
  startGame();
}

void loop() {
  // read the analog in value:
  sensorValue = analogRead(analogInPin);
  // map it to the range of the analog out:
  int score = abs(findValue - sensorValue);
  outputValue = map(score, 1014, 0, 0, 255);
  // change the analog out value:
  analogWrite(analogOutPin, abs(outputValue));

  redButOut = digitalRead(redPlrPin);
  bluButOut = digitalRead(bluPlrPin);

  if ((bluPlrWin == false || redPlrWin == false) && redButOut == HIGH && (score <= 360) )
  {
    redPlrWin = true;
  }

  if ((bluPlrWin == false || redPlrWin == false) && bluButOut == HIGH && (score <= 360) )
  {
    bluPlrWin = true;
  }

  if (redPlrWin == true){
    digitalWrite(redWinLED,HIGH);
    Serial.println("RED WIN");
    delay(5000);
    digitalWrite(redWinLED,LOW);
    redPlrWin = false;
    bluPlrWin = false;
    isValueFound = false;
    startGame();
  }

  if (bluPlrWin == true){
    digitalWrite(bluWinLED,HIGH);
    Serial.println("BLUE WIN");
    delay(5000);
    digitalWrite(bluWinLED,LOW);
    bluPlrWin = false;
    redPlrWin = false;
    isValueFound = false;
    startGame();
  }


  // print the results to the Serial Monitor:
  //Serial.print("sensor = ");
  //Serial.print(sensorValue);
  //Serial.print("\t output = ");
  //Serial.println(abs(outputValue));
  Serial.print("\t Score =");
  Serial.println(score);

  // wait 2 milliseconds before the next loop for the analog-to-digital
  // converter to settle after the last reading:
  delay(2);
}

void startGame() {
  findValue = (random() % 1014) + 15;
  findValueLow = findValue - 15;
  findValueHigh = findValue + 15;
  Serial.println(findValue);
}