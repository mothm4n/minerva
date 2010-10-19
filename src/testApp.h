#ifndef _TEST_APP
#define _TEST_APP





#include "ofMain.h"
#include "ofxNetwork.h"
#include "ofxGuiApp.h"

class testApp : public ofxGuiApp{

	public:

		void setup();
		void update();
		void draw();

		void keyPressed(int key);
		void keyReleased(int key);
		void mouseMoved(int x, int y );
		void mouseDragged(int x, int y, int button);
		void mousePressed(int x, int y, int button);
		void mouseReleased(int x, int y, int button);
		void windowResized(int w, int h);
		
			
		
		bool updateReset();
		bool drawReset();
		
		bool StartInitial();

		bool updateA();
		bool drawA();

		bool updateB();
		bool drawB();

		bool updateC();
		bool drawC();

		bool updateD();
		bool drawD();

		bool updateE();
		bool drawE();

		bool updateF();
		bool drawF();

		bool updateG();
		bool drawG();
		
		bool updateH();
		bool drawH();

		bool updateI();
		bool drawI();
		
		bool updateK();
		bool drawK();

		bool updateL();
		bool drawL();

		bool updateM();
		bool drawM();

		bool updateN();
		bool drawN();


		ofxTCPClient tcpClient;
		string msgTx, msgRx;


		//GRAFICOOOOS
		ofTrueTypeFont  mono;
		ofTrueTypeFont  monosm;
		ofTrueTypeFont  monosS;

		ofImage pantalla;
		ofImage pantfons;
		ofImage barrita;
		ofImage minipant;

		ofImage IMGichidai;
		ofImage IMGnidai;
		ofImage IMGsandai;


		//SONIDOOOOOS
		ofSoundPlayer  pingCountDown;
		ofSoundPlayer  alert;
		
		ofSoundPlayer  toroidEnd;
		ofSoundPlayer  toroidLoop;
		ofSoundPlayer  toroidStart;
		
		ofSoundPlayer  portalEnd;
		ofSoundPlayer  portalLoop;
		ofSoundPlayer  portalAmbient;
		ofSoundPlayer  portalStart;

		ofSoundPlayer  electroON;
		ofSoundPlayer  coolON;
		ofSoundPlayer  ambientPC;

		ofSoundPlayer  teleportEnd;
		ofSoundPlayer  teleportLoop;
		ofSoundPlayer  teleportStart;

		ofSoundPlayer  turnONpc;
		ofSoundPlayer  turnONmonitors;

		ofSoundPlayer  powerDown;
		ofSoundPlayer  powerUp;

		ofSoundPlayer  Pica;

		//VARIABLEEEES


		float counter;
		int connectTime;
		int deltaTime;

		bool enter;
		int dibujo;
		float bkg;
		

		int size;
		int pos;
		bool typed;

		
};

#endif

