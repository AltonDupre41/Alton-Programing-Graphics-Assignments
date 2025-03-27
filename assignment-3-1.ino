// constants won't change. They're used here to set pin numbers:
const int buttonPin = 2;  // the number of the pushbutton pin
const int buttonTwoPin = 3;
const int ledPin = 13;    // the number of the LED pin
const int blinkPin = 12;

// variables will change:
int buttonState = 0;  // variable for reading the pushbutton status
int buttonTwoState = 0;

unsigned long previousMillis = 0;
int blinkState = LOW; 

// Spells Boo in morse code
int blinkSeq[] = {100,600,100,200,100,200,100,200, 500,600,100,600,100,600, 500,600,100,600,100,600,100};
int seqSize = 22;
int i = 0;

void setup() {
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);
  pinMode(blinkPin, OUTPUT);
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);
  pinMode(buttonTwoPin, INPUT);
}

void loop() {
  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);
  unsigned long currentMillis = millis();

  // check if the pushbutton is pressed. If it is, the buttonState is HIGH:
  if (buttonState == HIGH) {
    // turn LED on:
    digitalWrite(ledPin, HIGH);
  } else {
    // turn LED off:
    digitalWrite(ledPin, LOW);
  }

   if (buttonTwoState == HIGH){
  } else {
    buttonTwoState = digitalRead(buttonTwoPin);
  }

  if (i == seqSize){
    i = 0;
    buttonTwoState = LOW;
    digitalWrite(blinkPin, LOW);
  }

  if (currentMillis - previousMillis >= blinkSeq[i] && buttonTwoState == HIGH) {
    // save the last time you blinked the LED
    previousMillis = currentMillis;
    i++;

    // if the LED is off turn it on and vice-versa:
    if (blinkState == LOW) {
      blinkState = HIGH;
    } else {
      blinkState = LOW;
    }

    // set the LED with the ledState of the variable:
    digitalWrite(blinkPin, blinkState);
  }
}