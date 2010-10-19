#include "testApp.h"

//Scala de la aplicació
	// para 1024x768 es 0.6 
	// para 1600x950 es 1
	float scale = 1;
	float pantX = 0;
	float pantY = 0;
	float pantZ = 0;
//Lista de Mundos
string Wrlds[] = {"985656",
				"532924",
				"452876",
				"654321",
				"825459",
				};

//Lista de habitaciones
int roomMAX= 10;
int roomPos = 0;
bool rooms[] = {false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false
				};
string cmds[] = {"ichidai reset all",
				"help", 
				"nidai start portal", 
				"ichidai plug w_matter",
				"ichidai plug cooling",
				"ichidai plug toroid",
				"nidai set reader",
				"sandai show connections",
				"nidai connect",
				"nidai check beacon",
				"sandai anchor connect",
				"                   ",
				"ichidai show power",
				"ichidai show cooling",
				"ichidai show w_matter",
				"nidai start teleport"
				};
int konamiCode[]= {OF_KEY_UP,
					OF_KEY_UP,
					OF_KEY_DOWN,
					OF_KEY_DOWN,
					OF_KEY_LEFT,
					OF_KEY_RIGHT,
					OF_KEY_LEFT,
					OF_KEY_RIGHT,
					'b',
					'a'
					};


int indice,ocult,maxcmd,konamiPos,tabPos,telportDest;
string lista,Pswrd,ichidaiPswrd,nidaiPswrd,sandaiPswrd,WorldPass,beaconPass;
bool negro,full,panel,ichidaiPass,nidaiPass,sandaiPass,ichidaiOK,nidaiOK,sandaiOK,show,OK,homeOK,portalOK,trobat,teleportOK;
bool portalOKAnt = false;
bool teleportOKAnt=false;
int linePos,linePosX,showPos,Ti,T,Ta,WorldExt,WorldMAX,seed1,seed2,MinusKonami,KonamiTempus,beaconExt;
size_t cPos,tPos;

bool aOK,bOK,cOK,dOK,eOK,fOK,gOK,hOK,iOK,jOK,ordenOK,worldOK;
bool oldVer = false;


//--------Variables SUPERIMPORTANTES-------

float electro,cool,Wmat,WmatMAX,coolMAX,electroMAX,f,q; // Electricidad restante, Refrigeracion, Materia W 
bool magneto; // Estado electromagnetico de la puerta
bool magnetoAnt=false; //el estado anterior de magneto (para saber si canvia i hacer el sonido)
int conex; // tanto porciento de conexión con los otros Universos

//-------Variables Ichidai
int ichiX,ichiY;
int countdownB,countdownC,countdownD,countdownK,countdownM,countdownL;

bool Richi,R1ichi;

bool ShowPower;
int maxvolt=40;//Tiene que ser el mismo que voltages
int voltages[40];

bool Showtemp;
int maxtemp=40;//Tiene que ser el mismo que voltages
int temp[40];

bool ShowTubosWmat;
int maxTubosWmat=10;//Tiene que ser el mismo que voltages
int Tubos[10];

//-------Variables Nidai
int nidaX,nidaY;
int countdownE, countdownG,countdownH,countdownI;
bool Rnida,R1nida;

//-------Variables sandai
int sandaX,sandaY;
int countdownF,worldNum;
float g,n,sinc;
bool fON,selectionOK,gameON,gameOK,Rsanda,R1sanda;
//Variables Generals
int countdownReset;

//--------------------------------------------------------------
bool DevMode=false;
	/*if(ofGetScreenWidth()<1200 && ofGetScreenWidth()>1100){
		scale=0.7;
	}else if(ofGetScreenWidth()<=1024){
		scale=0.7;
	}*/

void testApp::setup(){
	OK=false;
	// we don't want to be running to fast
	ofSetVerticalSync(true);
	
	//ofSetFrameRate(60);

	//load our type
	mono.loadFont("type/automat.ttf",10,true,true,false);
	//VARIABLES SO
	pingCountDown.loadSound("sounds/CD.wav");
	alert.loadSound("sounds/alert.wav");

	toroidEnd.loadSound("sounds/toroidEnd.wav");
	toroidStart.loadSound("sounds/toroidStart.mp3");
	toroidLoop.loadSound("sounds/toroidLoop.wav");

	portalEnd.loadSound("sounds/portalEnd.wav");
	portalStart.loadSound("sounds/portalStart.mp3");
	portalAmbient.loadSound("sounds/portalAmbient.ogg");
	portalLoop.loadSound("sounds/portalLoop.wav");

	electroON.loadSound("sounds/electroON.wav");
	coolON.loadSound("sounds/coolON.mp3");

	ambientPC.loadSound("sounds/ambientPC.wav");
	ambientPC.setVolume(0.1);

	teleportEnd.loadSound("sounds/teleportEnd.wav");
	teleportStart.loadSound("sounds/teleportStart.mp3");
	teleportLoop.loadSound("sounds/teleportLoop.wav");

	turnONmonitors.loadSound("sounds/turnONmonitors.mp3");
	turnONpc.loadSound("sounds/turnONpc.wav");
	powerDown.loadSound("sounds/powerDown.mp3");
	powerUp.loadSound("sounds/powerUp.mp3");

	Pica.loadSound("sounds/Pica.wav");
	Pica.setVolume(0.5);



	//VARIABLES GENERALS
	//numero de comandes ocultes (va ocultant de adalt de la llista (osease si son 16 oculta la 15 si es 1))
	ocult=0;
	//Total de comandes
	maxcmd=16;
	//index de la comanda
	indice = -1;
	//per saber si hem picat el teclat
	typed	= false;
	//variable FullScreen
	full= false;
	//Variable de la longitud del codigo del mundo	
	WorldExt = 6;
	//Numero maximo de mundos
	WorldMAX = 5;
	//Variable de la longitud del codigo del mundo	
	beaconExt = 2;
	//Ordre de comandes
	ordenOK=false;
	portalOK=false;
	//posicio de la konami
	konamiPos=0;
	MinusKonami=2;
	KonamiTempus=10;
	//teleport
	teleportOK=false;
	//variables de utilitats
	tabPos=0;
	trobat=false;
	telportDest=-1;
	//Variables del Tempus

	
	Ta=0;

	//RESET
	
	Richi=false;
	R1ichi=false;
	Rnida=false;
	R1nida=false;
	Rsanda=false;
	R1sanda=false;

	//VARIABLES ICHIDAI
	ichidaiPswrd="123";
	ichidaiPass=false;
	ichidaiOK=false;
	if(ofGetScreenWidth()>1200){
		ichiX=(ofGetScreenWidth()-1200)/4 ;
	}else{
		ichiX=25+70;
	}
	ichiY=200;


	countdownB = 10;
	countdownC = 10;
	countdownD = 10;
	countdownE = 10;
	countdownF = 40;
	countdownG = 10;
	countdownH = 10;
	countdownI = 10;
	countdownReset = 100;
	countdownK = 5;
	countdownL = 5;
	countdownM = 5;

	aOK=false;
	bOK=false;
	cOK=false;
	dOK=false;
	eOK=false;
	fOK=false;
	gOK=false;
	hOK=false;
	iOK=false;
	jOK=false;
	ordenOK=false;
	worldOK=false;

	//regilla de voltages
	ShowPower= false;
	
	
	for(int i = 0;i<maxvolt;i++){
		voltages[i]= (int) (ofRandom(-10, 50));

	}
	//regilla temperatures
	Showtemp= false;
	
	
	for(int i = 0;i<maxtemp;i++){
		temp[i]= (int) (ofRandom(-172, 300));

	}
	//regilla tubos w_mattt
	ShowTubosWmat= false;
	
	for(int i = 0;i<maxTubosWmat;i++){
		Tubos[i]= (int) (ofRandom(50, 100));

	}

	//VARIABLES Nidai
	nidaiPswrd="456";
	nidaiPass=false;
	nidaiOK=false;

	if(ofGetScreenWidth()>1200){
		nidaX=((ofGetScreenWidth()-1200)/4*2)+400 ;
	}else{
		nidaX=25+60+400+48 ;
	}
	nidaY=200;


	//VARIABLES Sandai
	sandaiPswrd="789";
	sandaiPass=false;
	sandaiOK=false;

	if(ofGetScreenWidth()>1200){
		sandaX=((ofGetScreenWidth()-1200)/4*3)+800 ;
	}else{
		sandaX=25+90+800+60 ;
	}
	sandaY=200;
	
	fON=false;
	selectionOK=false;
	gameON=false;
	gameOK=false;
	g=0.1;
	n=0.1;
	sinc=0;
	worldNum=0;

	//VARIABLES IMPORTANTS
	electro= 200;
	cool= 0;
	Wmat= 0;
	WmatMAX=100;
	coolMAX=100;
	electroMAX=200;
	magneto=false;
	conex=0;

	//VARIABLES DE GRAFICS

	
	pantalla.loadImage("img/pant.png");
	pantfons.loadImage("img/pantfons.png");
	barrita.loadImage("img/barrita.png");
	minipant.loadImage("img/minipant.png");

	IMGichidai.loadImage("img/ichidai.png");
	IMGnidai.loadImage("img/nidai.png");
	IMGsandai.loadImage("img/sandai.png");

	//some variables
	if(ofGetScreenWidth()>1200){
		linePos = ofGetScreenHeight() -150;
	}else{
		linePos = ofGetScreenHeight();
	}

	linePosX=nidaX-28 ;
	
	if(ofGetScreenWidth()>1200){
		showPos = ofGetScreenHeight() -180;
	}else{
		showPos = linePos-20;
	}
	
	panel= true;
	q=50;
	//have we typed

	//our typing position
	pos		= 0;
	show=false;

	//our send and recieve strings
	msgTx	= "";
	msgRx	= "";
	Pswrd   = "";

	dibujo=-1;
	enter =0;
	negro= false;

	lista="";

	lista.append("Los Comandos existentes son:\n\n");
			for( int i = 0; i < (maxcmd-ocult); i++ ) {
				if(oldVer){
						if(i==14 || i==3 || i==11) continue;
						lista.append(cmds[i]);
						lista.append("\n");
					
				}else{
					if(i==15 || i==9 || i==10 || i==11) continue;
						lista.append(cmds[i]);
						lista.append("\n");
					
				
				}
			}
}

//--------------------------------------------------------------
void testApp::update(){
	if(enter){
		enter=false;

		ichidaiOK=false;
		nidaiOK=false;
		sandaiOK=false;

		msgRx = msgTx;
		show= false;
		if(ichidaiPass||nidaiPass||sandaiPass){
			Pswrd = "";
		}
		msgTx = "";
		pos = 0;
		
		if(ichidaiPass||nidaiPass||sandaiPass){
			if(ichidaiPass&&msgRx==ichidaiPswrd){
				ichidaiOK=true;
				Ti=ofGetElapsedTimeMillis();
				Ta=0;
				ShowPower=false;
				Showtemp=false;
				ShowTubosWmat=false;
			}else if(nidaiPass&&msgRx==nidaiPswrd){
				Ti=ofGetElapsedTimeMillis();
				Ta=0;
				nidaiOK=true;
			}else if(sandaiPass&&msgRx==sandaiPswrd){
				Ti=ofGetElapsedTimeMillis();
				Ta=0;
				sandaiOK=true;
			}else{
				indice=-1;
			}
				ichidaiPass=false;
				nidaiPass=false;
				sandaiPass=false;
		}else{

				for( int i = 0; i < maxcmd; i++ ) {

					cPos=msgRx.find(cmds[i]);
					
					if(cPos!=string::npos){

						indice = i;
						OK=true;
						break;
					}else {
						indice = -1;
					}
				
				}

				//para coger el numero de mundo
				if(indice == 8){
					if(msgRx.size()>=cPos+14+WorldExt){
						WorldPass = msgRx.substr(cPos+14,WorldExt);
					}else{
						indice = 11;
					}
				}

				//para coger el numero de habitacion
				if(indice == 9){
					if(msgRx.size()>=cPos+19+beaconExt){
						beaconPass = msgRx.substr(cPos+19,beaconExt);
					}else{
						indice = 11;
					}
				}
				
				//para conectar al numero de habitacion
				if(indice == 10){
					if(msgRx.size()>=cPos+22+beaconExt){
						beaconPass = msgRx.substr(cPos+22,beaconExt);
					}else{
						indice = 11;
					}
				}
		}
	}
	
	if(!oldVer){
		if((indice == 9)||(indice == 10)||(indice == 15) || (indice==11) ){
			indice=-1;
		}
	}else{
		if(indice==3 || indice==14 || indice==11){
			indice=-1;
		}
	}
	
		switch(indice){
		case 0:
			
			if(!ichidaiOK){
				ichidaiPass=true;
			}else{
				updateReset();
				show=true;
			}
			break;
		case 1:
			
			break;
		case 2:
			
			if(!nidaiOK){
				nidaiPass=true;
			}else{
				updateA();
				show=true;
			}
			break;
		case 3:
			
			if(!ichidaiOK){
				ichidaiPass=true;
			}else{
				updateB();
				show=true;
			}
			break;
		case 4:
			
			if(!ichidaiOK){
				ichidaiPass=true;
			}else{
				updateC();
				show=true;
			}
			break;
		case 5:
			
			if(!ichidaiOK){
				ichidaiPass=true;
			}else{
				updateD();
				show=true;
			}
			break;
		case 6:
			
			if(!nidaiOK){
				nidaiPass=true;
			}else{
				updateE();
				show=true;
			}
			break;
		case 7:
			
			if(!sandaiOK){
				sandaiPass=true;
			}else{
				updateF();
				show=true;
			}
			break;
		case 8:
			
			if(!nidaiOK){
				nidaiPass=true;
			}else{
				updateG();
				show=true;
			}
			break;
		case 9:
			
			if(!nidaiOK){
				nidaiPass=true;
			}else{
				updateH();
				show=true;
			}
			break;
		case 10:
			
			if(!sandaiOK){
				sandaiPass=true;
			}else{
				updateI();
				show=true;
			}
			break;
		case 11:
		
			break;
		case 12:
			if(!ichidaiOK){
				ichidaiPass=true;
			}else{
				updateK();
				show=true;
			}
			break;
		case 13:
		if(!ichidaiOK){
				ichidaiPass=true;
			}else{
				updateL();
				show=true;
			}
			break;
		case 14:
			if(!ichidaiOK){
				ichidaiPass=true;
			}else{
				updateM();
				show=true;
			}
			break;
		case 15:
				if(!nidaiOK){
					nidaiPass=true;
				}else{
					updateN();
					show=true;
				}
			
			break;
		default:
			
			break;
		
		}

	// make 2 seconds loop
	//f = ((ofGetElapsedTimeMillis()%10000) / 10000.0);
	
	//cool=electro/(f*10);
	//electro-= 100*f;

//SONIDOS 

		//MAGNETO
		if(magneto && !magnetoAnt){
			if(!toroidStart.getIsPlaying()){
					toroidStart.play();
					magnetoAnt=true;
			}		
		}
		if(magneto && magnetoAnt){
				if(!toroidStart.getIsPlaying()){
					if(!toroidLoop.getIsPlaying()){
						toroidLoop.play();
					}
				}
			}

		if(!magneto && magnetoAnt){
			if(!toroidLoop.getIsPlaying()){
					toroidEnd.play();
					magnetoAnt=!magnetoAnt;
				}
			}

		//PORTAL OBERT

		
		if(portalOK && !portalOKAnt){
			if(!portalStart.getIsPlaying()){
					portalStart.play();
					portalOKAnt=true;
			}		
		}
		if(portalOK && portalOKAnt){
				toroidLoop.setVolume(0.5);
				electroON.setVolume(0.3);
				coolON.setVolume(0.5);
				ambientPC.setVolume(0.01);
				pingCountDown.setVolume(0.5);
				if(!portalStart.getIsPlaying()){
					if(!portalLoop.getIsPlaying()){
						portalLoop.play();
					}
					if((!portalAmbient.getIsPlaying()) && (portalStart.getPosition()>0.4)){
						portalAmbient.play();
					}
				}
			}

		if(!portalOK && portalOKAnt){
					toroidLoop.setVolume(1);
					electroON.setVolume((electro/electroMAX)/2);
					coolON.setVolume(cool/coolMAX);
					pingCountDown.setVolume(1);
					ambientPC.setVolume(0.1);
					portalEnd.play();
					portalAmbient.stop();
					portalLoop.stop();
					portalOKAnt=!portalOKAnt;
			
			}

			//ELECTRO
		if(!Richi){
			if(electro>0){
						electroON.setVolume((electro/electroMAX)/2);
						if(!electroON.getIsPlaying()){
							electroON.play();
						}
			}
		

			//COOLING
			if(cool>0){
						coolON.setVolume(cool/coolMAX);
						if(!coolON.getIsPlaying()){
							coolON.play();
						}
			}
		}

		//AMBIENT PCS
		if(!(Richi && Rnida && Rsanda)){
					if(!ambientPC.getIsPlaying()){
						ambientPC.play();
					}
		}
		
		//TELEPORT OBERT

		
		if(teleportOK && !teleportOKAnt){
			if(!teleportStart.getIsPlaying()){
					teleportStart.play();
					teleportOKAnt=true;
			}		
		}
		if(teleportOK && teleportOKAnt){
				toroidLoop.setVolume(0.3);
				electroON.setVolume(0.2);
				coolON.setVolume(0.2);
				pingCountDown.setVolume(0.3);
				ambientPC.setVolume(0.01);
				if(!teleportStart.getIsPlaying()){
					if(!teleportLoop.getIsPlaying()){
						teleportLoop.play();
					}
					if((!portalAmbient.getIsPlaying())){
						portalAmbient.play();
					}
				}
			}

		if(!teleportOK && teleportOKAnt){
					toroidLoop.setVolume(1);
					electroON.setVolume((electro/electroMAX)/2);
					coolON.setVolume(cool/coolMAX);
					pingCountDown.setVolume(1);
					ambientPC.setVolume(0.1);

					teleportEnd.play();
					portalAmbient.stop();
					teleportLoop.stop();
					teleportOKAnt=!teleportOKAnt;
			
			}

		
}

//--------------------------------------------------------------
void testApp::draw(){
		glPushMatrix();
		glTranslatef(pantX,pantY,pantZ);
		glScalef(scale,scale,scale);
		ofBackground(0,0, 0);
		ofSetBackgroundAuto(false);
		ofSetColor(255, 255, 255);


		//mono.drawString("Welcome to Minerva System by Mechanical Hope, the framereate is :  "+ofToString(ofGetFrameRate()), 15, 30);
	
	if(oldVer){
		if(!Richi){
			mono.drawString("ver. 0.69b",ichiX+295,ichiY);
		}
		if(!Rnida){
			mono.drawString("ver. 0.69b",nidaX+295,nidaY);
		}
		
		if(!Rsanda){
			if(!(indice==7 && show==true)){
				mono.drawString("ver. 0.69b",sandaX+295,sandaY);
			}
		}
		if(rooms[roomPos]){
			ofSetColor(255, 255, 255);
		}else{
			ofSetColor(255, 0, 0);
		}
		mono.drawString("R"+ofToString(roomPos),ofGetScreenWidth()-90,30);

	}else{
		
		if(!Richi){
			mono.drawString("ver. 10.0",ichiX+310,ichiY);
		}
		if(!Rnida){
			mono.drawString("ver. 10.0",nidaX+310,nidaY);
		}
		
		if(!Rsanda){
			if(!(indice==7 && show==true)){
				mono.drawString("ver. 10.0",sandaX+310,sandaY);
			}
		}
	}

	ofSetColor(255, 255, 0);
	
	if(!(R1ichi && R1nida && R1sanda)){
		if(ichidaiPass||nidaiPass||sandaiPass){
			mono.drawString(">:Enter Password:", linePosX, linePos);
			if(typed){
				mono.drawString(Pswrd, linePosX+160, linePos);
			}
		}else{
			if(!(ichidaiOK||nidaiOK||sandaiOK)){
			mono.drawString(">:", linePosX, linePos);
			}
			if(typed){
				mono.drawString(msgTx, linePosX+12, linePos);
			}
		}
	}
			
		
		
		
		/***************************************/
		//
		//Pantalla Ichidai
		//
		/***************************************/
				
		ofSetColor(255, 255, 255);
		
		//DIBUJAMOS LA PANTALLA
		
	if(!R1ichi){
		if(!oldVer){
			ofEnableAlphaBlending();
				pantalla.draw(ichiX-34,ichiY-34);
			ofDisableAlphaBlending();
		}else{
			ofNoFill();
			ofRect(ichiX-15,ichiY-15,400,300);
		}
	}
		
	if(!Richi){
		if(!(ShowPower || Showtemp || ShowTubosWmat)){
			if(!oldVer){
				ofEnableAlphaBlending();
					IMGichidai.draw(ichiX-9, ichiY-50);
				ofDisableAlphaBlending();
			}else{
				mono.drawString("Ichidai", ichiX-10, ichiY-20);
			}
			//mono.drawString("ichidai: "+ofToString(ichidaiPass)+" - "+ofToString(ichidaiOK)+" - "+ofToString(show), ichiX, ichiY);
			//BARRETA I VALOR DE ELECTRO
			ofSetColor((int)((1-(electro/electroMAX))*255),0, (int)((electro/electroMAX)*255));
			ofFill();
			ofRect(ichiX+1,ichiY+7,((electro/electroMAX)*300),8);
			if(!oldVer){
				ofEnableAlphaBlending();
					barrita.draw(ichiX,ichiY+6);
				ofDisableAlphaBlending();
			}
			mono.drawString("Electric Charge: "+ofToString(electro)+"%", ichiX, ichiY+25);
		
			//BARRETA I VALOR DE COOL
			ofSetColor((int)((1-(cool/coolMAX))*255),0, (int)((cool/coolMAX)*255));
			ofFill();
			ofRect(ichiX+1,ichiY+32,((cool/coolMAX)*300),8);
			if(!oldVer){
				ofEnableAlphaBlending();
					barrita.draw(ichiX,ichiY+31);
				ofDisableAlphaBlending();
			}
			mono.drawString("Cooler: "+ofToString(cool)+"%", ichiX, ichiY+50);
			if(!oldVer){
				//BARRETA I VALOR DE Wmat
				ofSetColor((int)((1-(Wmat/WmatMAX))*255),(int)((Wmat/WmatMAX)*255), (int)((Wmat/WmatMAX)*255));
				ofFill();
				ofRect(ichiX+1,ichiY+57,((Wmat/WmatMAX)*300),8);
				if(!oldVer){
					ofEnableAlphaBlending();
						barrita.draw(ichiX,ichiY+56);
					ofDisableAlphaBlending();
				}

				mono.drawString("W matter: "+ofToString(Wmat)+"%", ichiX, ichiY+76);
			}
		
			//DIBUJAMOS Fondo de PANTALLA
			if(!oldVer){
				ofSetColor(255, 255, 255);
				ofEnableAlphaBlending();
					pantfons.draw(ichiX-34,ichiY-34);
				ofDisableAlphaBlending();
			}
			
			ofSetColor(255, 255, 255);
			if(bOK){
				if(!oldVer){
				mono.drawString("W_Matter..........OK", ichiX, ichiY+96);
				}
			}
			if(cOK){
				mono.drawString("Cooling...........OK", ichiX, ichiY+116);
			}
			if(dOK){
				mono.drawString("Magnetic Flux.....OK", ichiX, ichiY+136);
			}
		
			//mono.drawString("esta en ordre?: "+ofToString(ordenOK)+" i es "+ofToString(bOK)+" "+ofToString(cOK)+" "+ofToString(dOK)+" "+ofToString(eOK)+" "+ofToString(fOK)+" "+ofToString(gOK)+" ", ichiX, ichiY+190);
		}else if(ShowPower){
			
			//DIBUJAMOS Fondo de PANTALLA
			if(!oldVer){
				ofSetColor(255, 255, 255);
				ofEnableAlphaBlending();
					pantfons.draw(ichiX-34,ichiY-34);
				ofDisableAlphaBlending();
			}
			//Aqui esta lo que surt al posar lo dels voltatges
			for(int j = 0;j<( (int) (maxvolt/4));j++){
				for(int i = 0;i<4;i++){
					if((voltages[j+i]*(electro/electroMAX))<0){
						ofSetColor(255,255,0);
					}else if((voltages[j+i]*(electro/electroMAX))==0){
						ofSetColor(255,0,0);
					}else{
						ofSetColor(0,0,255);
					}
					if(voltages[j+i]<0){
						mono.drawString("Vol"+ofToString(j+i)+":[¬"+ofToString((int) (voltages[j+i]*-1*(electro/electroMAX)))+"V]", ichiX+(i*95), ichiY+(j*30));
					}else{
						mono.drawString("Vol"+ofToString(j+i)+":["+ofToString((int) (voltages[j+i]*(electro/electroMAX)))+"V]", ichiX+(i*95), ichiY+(j*30));
					}
				}
			}

		}else if(Showtemp){
			
			//DIBUJAMOS Fondo de PANTALLA
			if(!oldVer){
				ofSetColor(255, 255, 255);
				ofEnableAlphaBlending();
					pantfons.draw(ichiX-34,ichiY-34);
				ofDisableAlphaBlending();
			}
			//Aqui esta lo que surt al posar lo deles temperatures
			for(int j = 0;j<( (int) (maxtemp/4));j++){
				for(int i = 0;i<4;i++){
					if((temp[j+i]-(100*(cool/coolMAX)))<0){
						ofSetColor(125,125,(abs((temp[j+i]-(100*(cool/coolMAX))))/273)*255);
					}else if((temp[j+i]-(100*(cool/coolMAX)))==0){
						ofSetColor(255,255,255);
					}else{
						ofSetColor(125,125,255-((abs((temp[j+i]-(100*(cool/coolMAX))))/273)*500));
					}
					if((temp[j+i]-(100*(cool/coolMAX)))<0){
						if((temp[j+i]-(100*(cool/coolMAX)))>-273){
							mono.drawString("Tmp"+ofToString(j+i)+":¬"+ofToString((int) ((temp[j+i]-(100*(cool/coolMAX)))*-1))+"ºC", ichiX+(i*101)-17, ichiY+(j*30));
						}else{
							mono.drawString("Tmp"+ofToString(j+i)+":¬"+ofToString((int) 273)+"ºC", ichiX+(i*101)-17, ichiY+(j*30));
						}
					}else{
						mono.drawString("Tmp"+ofToString(j+i)+":"+ofToString((int) (temp[j+i]-(100*(cool/coolMAX))))+"ºC", ichiX+(i*101)-17, ichiY+(j*30));
					}
				}
			}
		}else if(ShowTubosWmat){
			

			//DIBUJAMOS Fondo de PANTALLA
			if(!oldVer){
				ofSetColor(255, 255, 255);
				ofEnableAlphaBlending();
					pantfons.draw(ichiX-34,ichiY-34);
				ofDisableAlphaBlending();
			}
			if(!oldVer){
				for(int j = 0;j<(int) maxTubosWmat;j++){
					ofSetColor(128,128,128);
					ofNoFill();
					ofRect(ichiX+65,ichiY+(j*30)-12,((Tubos[j]*(Wmat/WmatMAX)/100)*300),20);
					ofSetColor(255,255,255);
					mono.drawString("Wmat"+ofToString(j)+": "+ofToString(Tubos[j]*(Wmat/WmatMAX)), ichiX, ichiY+(j*30));
			
				}
			}
		}
	}

		
		
		
		/***************************************/
		//
		//Pantalla Nidai
		//
		/***************************************/
	if(!R1nida){
		//DIBUJAMOS LA PANTALLA
		if(!oldVer){
			ofSetColor(255, 255, 255);
			ofEnableAlphaBlending();
				pantalla.draw(nidaX-34,nidaY-34);
			ofDisableAlphaBlending();
		}else{
			ofSetColor(255, 255, 255);
			ofNoFill();
			ofRect(nidaX-15,nidaY-15,400,300);
		}
	}
	if(!Rnida){
		//DIBUJAMOS Fondo de PANTALLA
		if(!oldVer){
			ofSetColor(255, 255, 255);
			ofEnableAlphaBlending();
				pantfons.draw(nidaX-34,nidaY-34);
			ofDisableAlphaBlending();
		}
			if(!oldVer){
				ofEnableAlphaBlending();
					IMGnidai.draw(nidaX-5, nidaY-50);
				ofDisableAlphaBlending();
			}else{
				mono.drawString("Nidai", nidaX-10, nidaY-20);
			}
		
		//mono.drawString("nidai: "+ofToString(nidaiPass)+" - "+ofToString(nidaiOK)+" - "+ofToString(show), nidaX, nidaY);
		if(magneto){
			mono.drawString("Electromagnetic flux: ON", nidaX, nidaY+20);
		}else{
			mono.drawString("Electromagnetic flux: OFF", nidaX, nidaY+20);
		}
		
		ofSetColor(255, 255, 255);
		if(eOK){
			mono.drawString("Beta Spectrum reading.....OK", nidaX, nidaY+40);
		}

		if(gOK){
			mono.drawString("Connected to "+WorldPass+" B Spectrum wave..OK", nidaX, nidaY+60);
		}
		
	}


		/***************************************/
		//
		//Pantalla Sandai
		//
		/***************************************/
	if(!R1sanda){
		//DIBUJAMOS LA PANTALLA
		ofSetColor(255, 255, 255);
		if(!oldVer){
			ofEnableAlphaBlending();
				pantalla.draw(sandaX-34,sandaY-34);
			ofDisableAlphaBlending();
		}else{
			ofSetColor(255, 255, 255);
			ofNoFill();
			ofRect(sandaX-15,sandaY-15,400,300);
		}
	}
	if(!Rsanda){
		//DIBUJAMOS Fondo de PANTALLA sandai
		if(!oldVer){
			ofSetColor(255, 255, 255);
			ofEnableAlphaBlending();
				pantfons.draw(sandaX-34,sandaY-34);
			ofDisableAlphaBlending();
		}
			if(!oldVer){
				ofEnableAlphaBlending();
					IMGsandai.draw(sandaX-5, sandaY-50);
				ofDisableAlphaBlending();
			}else{
				mono.drawString("Sandai", sandaX-10, sandaY-20);
			}

		if(!(indice==7 && show==true)){
			ofSetColor(255, 255, 255);
		
			//mono.drawString("sandai: "+ofToString(sandaiPass)+" - "+ofToString(sandaiOK)+" - "+ofToString(show), sandaX, sandaY);
			mono.drawString("Beta Spectrum Connection: "+ofToString(conex)+"%", sandaX, sandaY+20);
	
			if(fOK){
				mono.drawString("Beta Spectrum wave found.....OK", sandaX, sandaY+40);
			}
		
			if(iOK){
				mono.drawString("Connected to "+ofToString(telportDest)+" B Spectrum wave..OK", sandaX, sandaY+60);
			}
		}
	}



		//*************************
		//
		//Nuestro lugar para mostrar los indices, 
		//esta al final para que no esten superpuestos nuestros graficos
		//
		//*************************
		
		ofSetColor(255, 255, 0);
if(!(R1ichi && R1nida && R1sanda)){
		switch(indice){
		case 0:
			if(show){
				drawReset();
			}
			break;
		case 1:
			
			mono.drawString(lista, linePosX, showPos-240);
			break;
		case 2:
			if(show){
				drawA();
			}
			break;
		case 3:
			if(show){
				drawB();
			}
			break;
		case 4:
			if(show){
				drawC();
			}
			break;
		case 5:
			if(show){
				drawD();
			}
			break;
		case 6:
			if(show){
				drawE();
			}
			break;
		case 7:
			if(show){
				drawF();
			}
			break;
		case 8:
			if(show){
				drawG();
			}
			break;
		case 9:
			if(show){
			drawH();
			}
			break;
		case 10:
			if(show){
			drawI();
			}
			break;
		case 11:
			mono.drawString("Error", linePosX, showPos);
			
			break;
		case 12:
			if(show){
				drawK();
			}
			break;
		case 13:
			if(show){
				drawL();
			}
			break;
		case 14:
			if(show){
				drawM();
			}
			break;
		case 15:
			if(show){
				drawN();
			}
			break;
		default:
			mono.drawString("-------------------", linePosX, showPos);
			break;
		
		}
}

if(DevMode){
	ofSetColor(255,255,255);

	ofLine(0,0,10,10);
	ofLine(ofGetScreenWidth(),ofGetScreenHeight(),ofGetScreenWidth()-10,ofGetScreenHeight()-10);
	ofLine(0,ofGetScreenHeight(),10,ofGetScreenHeight()-10);
	ofLine(ofGetScreenWidth(),0,ofGetScreenWidth()-10,10);

	ofLine(1,0,0,10);
	ofLine(0,1,10,0);
	ofLine(ofGetScreenWidth(),ofGetScreenHeight(),ofGetScreenWidth(),ofGetScreenHeight()-10);
	ofLine(ofGetScreenWidth(),ofGetScreenHeight(),ofGetScreenWidth()-10,ofGetScreenHeight());
	ofLine(0,ofGetScreenHeight(),0,ofGetScreenHeight()-10);
	ofLine(0,ofGetScreenHeight(),10,ofGetScreenHeight());

	ofLine(ofGetScreenWidth(),0,ofGetScreenWidth(),10);
	ofLine(ofGetScreenWidth(),0,ofGetScreenWidth()-10,0);
	mono.drawString("DevMode ON \n Para cambiar tamaño pantalla usar PageUp and PageDown \n Escala es: "+ofToString(scale), 10, 30);

	/*
	ofLine(,0,ofGetScreenWidth()-100,0);
	ofLine(ofGetScreenWidth(),100,0,100);
	
	ofLine(ofGetScreenWidth(),ofGetScreenHeight(),ofGetScreenWidth()-100,ofGetScreenHeight());
	ofLine(ofGetScreenWidth(),ofGetScreenHeight(),ofGetScreenWidth(),ofGetScreenHeight()-100);
	
	ofLine(0,ofGetScreenHeight(),100,ofGetScreenHeight());
	ofLine(0,ofGetScreenHeight(),0,ofGetScreenHeight()-100);*/

}
		glPopMatrix();

}


//--------------------------------------------------------------
void testApp::keyPressed(int key){

		
	if(!(ichidaiOK||nidaiOK||sandaiOK)){
			
		if(key == 8 || key == 127){
			if( pos != 0 ){
				pos--;
				msgTx = msgTx.substr(0,pos);
			}else msgTx = "";
		}else if(!( key == 13 || key == OF_KEY_F12 || key > 127 || key < 32 )){
			Pica.play();
			msgTx.append(1, (char) key);
			pos++;
		}
		
		typed = true;

		if(ichidaiPass||nidaiPass||sandaiPass){
			if(key == 8 || key == 127|| key > 127 || key < 32 ){
				Pica.play();
			if(key == 8 || key == 127){
				Pswrd = Pswrd.substr(0,pos);
			}
			}else{
				Pswrd.append(1, '*');
			}
		}


	}


	//MASTER CONTROL OF ELECTRO
	if(key == OF_KEY_F1  ){
	
		if (electro>0 ){
			electro--;
		}
	}
	if(key == OF_KEY_F2  ){

	if (electro<electroMAX ){
			electro++;
		}
	}

	
	//MASTER CONTROL OF COOLING
	if(key == OF_KEY_F3  ){
	if (cool>0 ){
			cool--;
		}
	}
	if(key == OF_KEY_F4  ){

	if (cool<coolMAX ){
			cool++;
		}
	
	}

	
	//MASTER CONTROL OF W_Matter
	if(key == OF_KEY_F5  ){
	if (Wmat>0 ){
			Wmat--;
		}
	
	}
	if(key == OF_KEY_F6  ){
	
	if (Wmat<WmatMAX ){
			Wmat++;
		}
	}

	
	if(key == OF_KEY_F7  ){
	
	if (conex>0 ){
			conex--;
		}
	}
	if(key == OF_KEY_F8  ){
	
	
	if (conex<100 ){
			conex++;
		}
	}


	if(key == OF_KEY_F9  ){
		StartInitial();
	
	}
	if(key == OF_KEY_F10  ){

		DevMode = !DevMode;
	
	}

	if(!DevMode){
		if(key == OF_KEY_PAGE_UP){
			if(roomPos<(roomMAX-1)){
				roomPos++;
			}else{
				roomPos=0;
			}
		}	
	
		if(key == OF_KEY_PAGE_DOWN){
	
			if(roomPos>0){
				roomPos--;
			}else{
				roomPos=(roomMAX-1);
			}
		}
	}else{
		if(key == OF_KEY_PAGE_UP){
			scale+=0.01;
		}	
	
		if(key == OF_KEY_PAGE_DOWN){
			if(scale>0){
				scale-=0.01;
			}
		}

			if(key == OF_KEY_UP){
				pantY--;

			}
			if(key == OF_KEY_DOWN){
				pantY++;
			}

			if(key == OF_KEY_LEFT){
				pantX--;
			}
			if(key == OF_KEY_RIGHT){
				
				pantX++;
			}
	}

	if(key == OF_KEY_END){
		rooms[roomPos] = !rooms[roomPos]; 
	}	

	if(indice==7 && show==true && gameON){
			if(key == OF_KEY_RETURN){
				gameOK=true;
			}
			if(key == OF_KEY_UP){
				if(g<1){
					g+=0.01;
				}

			}
			if(key == OF_KEY_DOWN){
				
				if(g>0){
					g-=0.01;
			
				}
			}

			if(key == OF_KEY_LEFT){
				
				if(n>0){
					n-=0.01;
			
				}
			}
			if(key == OF_KEY_RIGHT){
				
				if(n<1){
					n+=0.01;
			
				}
			}
		
		}
}

//--------------------------------------------------------------
void testApp::keyReleased(int key){

	if(!(ichidaiOK||nidaiOK||sandaiOK)){
		if(key == 13){
			enter =true;
		}

		
		
		//AUTOCOMPLETAR....
		/*
		if(key == 11){
			
			pingCountDown.play();
			while ((tabPos<maxcmd) && (!trobat)) {
			
				tPos=cmds[tabPos].find(msgTx);
				tabPos++;
				if (tPos!=string::npos){
					trobat=true;
					msgTx=cmds[tabPos];
				}

			}
			if(tabPos<maxcmd){
				tabPos=0;
			}
			trobat=false;
		}
		*/
	}
	
	
	
		if(key == OF_KEY_F12  ){	

				ofToggleFullscreen();
		}

		if(key == OF_KEY_F11  ){	
			
			setup();
		}
		if(key == OF_KEY_INSERT  ){	
			
			oldVer=!oldVer;
			lista="";
			lista.append("Los Comandos existentes son:\n\n");
			for( int i = 0; i < (maxcmd-ocult); i++ ) {
				
				if(oldVer){
						if(i==14 || i==3 || i==11) continue;
						lista.append(cmds[i]);
						lista.append("\n");
					
				}else{
					if(i==15 || i==9 || i==10 || i==11) continue;
						lista.append(cmds[i]);
						lista.append("\n");
					
				
				}
			}
		}

		if(portalOK){
			if((key == OF_KEY_UP)||(key == OF_KEY_DOWN)||(key == OF_KEY_LEFT)||(key == OF_KEY_RIGHT)||(key == 'a')||(key == 'b')){
				if(key==konamiCode[konamiPos]){
					konamiPos++;

				}else{
				konamiPos=0;
				}
				if(konamiPos==10){
					if(conex+KonamiTempus<100){
						conex+=KonamiTempus;
					}
					KonamiTempus-=MinusKonami;
					konamiPos=0;
				}
		
			}
		}

		if(indice==7 && show==true && !selectionOK){
			if(key == OF_KEY_RETURN){
				selectionOK=true;
			}
			if(key == OF_KEY_UP){
				if(worldNum<=0){
					worldNum=(WorldMAX-1);
				}else{
					worldNum--;
				}

			}
			if(key == OF_KEY_DOWN){

				
				if(worldNum>=(WorldMAX-1)){
					worldNum=0;
				}else{
					worldNum++;
				}
			}
		
		}

		


		

		
}

//--------------------------------------------------------------
void testApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void testApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void testApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void testApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void testApp::windowResized(int w, int h){

}

//**********************************************
//**Reset
//**********************************************
bool testApp::updateReset(){
	bool finish = false;

	float blokiti = countdownReset/12;
	float blokitiPart=blokiti/3;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;
	
	if(T==blokiti){
		Rnida=true;
		magneto=false;
		if(!powerDown.getIsPlaying()){
						powerDown.play();
					}
		//SONIDO ORDENADOR GRANDE APAGANDOSE
	}
	if(T==blokiti*2){
		Rsanda=true;
		if(!powerDown.getIsPlaying()){
						powerDown.play();
					}
		//SONIDO ORDENADOR GRANDE APAGANDOSE
	}
	if(T==blokiti*3){
		Richi=true;
		ambientPC.stop();
		coolON.stop();
		electroON.stop();
		if(!powerDown.getIsPlaying()){
						powerDown.play();
					}
		//SONIDO ORDENADOR GRANDE APAGANDOSE
	}
	if(T==blokiti*4){
			R1nida=true;
			R1sanda=true;
			R1ichi=true;
		//SONIDO MONITORES APAGANDOES
		
	}
	if(T==blokiti*5){
		//EMpezamos CANGUELE
	}
	if(T==blokiti*6){
		//Canguele de renicio de sistema... a lo JURASSIC PARK!!!
		
	}
	if(T==blokiti*7 ){
		//CANGUELE SIGUE
		
	}
	
	if(T==blokiti*8 ){
			R1nida=false;
			R1sanda=false;
			R1ichi=false;
			
			if(!turnONmonitors.getIsPlaying()){
				turnONmonitors.play();
			}
		
	}
	if(T==((blokiti*9)-3) ){
				if(!turnONpc.getIsPlaying()){
					turnONpc.play();
				}
			}
	if(T==blokiti*9 ){
			Rnida=false;
		//SONIDO SUPERORDENADOR ENCENDIENDOSE ON CHAN CHAN DE MAC
	}
			
		if(T==((blokiti*10)-3) ){
				if(!turnONpc.getIsPlaying()){
					turnONpc.play();
				}
			}
	if(T==blokiti*10 ){
			Rsanda=false;
			
			
		//SONIDO SUPERORDENADOR ENCENDIENDOSE ON CHAN CHAN DE MAC
	}
	if(T==((blokiti*11)-3) ){
				if(!turnONpc.getIsPlaying()){
					turnONpc.play();
				}
			}
	if(T==((blokiti*11)+2) ){
			setup();
			Richi=false;
		//SONIDO SUPERORDENADOR ENCENDIENDOSE ON CHAN CHAN DE MAC
	}
	
	if(T!=Ta&&T<blokiti*4){
			pingCountDown.play();
	}
	Ta=T;
	return finish;

}

bool testApp::drawReset(){
	bool finish = false;
	int blokiti = countdownReset/12;
	if(T<blokiti && T>0){
		mono.drawString("Turning Off Nidai..."+ofToString(blokiti-T), linePosX, showPos);
	}
	if(T<blokiti*2 && T>blokiti){
		mono.drawString("Turning Off Sandai..."+ofToString((blokiti*2)-T), linePosX, showPos);
	}
	if(T<blokiti*3 && T>blokiti*2){
		mono.drawString("Turning Off Ichidai..."+ofToString((blokiti*3)-T), linePosX, showPos);
	}
	if(T<blokiti*4 && T>blokiti*3){
		mono.drawString("Turning Off Monitor System..."+ofToString((blokiti*4)-T), linePosX, showPos);
	}
	if(T<blokiti*5 && T>blokiti*4){
		mono.drawString("Turning Off Console System..."+ofToString((blokiti*5)-T), linePosX, showPos);
	}
	if(T<blokiti*6 && T>blokiti*5){
		//Canguele de renicio de sistema... a lo JURASSIC PARK!!!
	}
	if(T<blokiti*7 && T>blokiti*6){
		mono.drawString("Restarting Console System..."+ofToString((blokiti*7)-T), linePosX, showPos);
	}
	if(T<blokiti*8 && T>blokiti*7){
		mono.drawString("Restarting Monitor System..."+ofToString((blokiti*8)-T), linePosX, showPos);
	}
	if(T<blokiti*9 && T>blokiti*8){
		mono.drawString("Restarting Nidai..."+ofToString((blokiti*9)-T), linePosX, showPos);
	}
	if(T<blokiti*10 && T>blokiti*9){
		mono.drawString("Restarting Sandai..."+ofToString((blokiti*10)-T), linePosX, showPos);
	}
	if(T<blokiti*11 && T>blokiti*10){
		mono.drawString("Restarting Ichidai..."+ofToString((blokiti*11)-T), linePosX, showPos);
	}
	if(T<blokiti*12 && T>blokiti*11){
		mono.drawString("System OK ", linePosX, showPos);
	}
	return finish;

}

//**********************************************
//**START PORTAL
//**********************************************
bool testApp::updateA(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;

	if(ordenOK && bOK && cOK &&  dOK && eOK && fOK && gOK){
		
		if(conex==0){
			show=false;
			nidaiOK=false;
			indice=-1;
			portalOK=false;
			KonamiTempus=10;
			conex=0;
			bOK=false;
			cOK=false;
			dOK=false;
			eOK=false;
			fOK=false;
			gOK=false;
			ordenOK=false;
			magneto=false;
		}
	
			if(T!=Ta&&conex>=0){
				if ((electro>=0 ) && (Wmat>=0) && (cool>=0)){
					electro-=1;
					Wmat-=1;
					cool-=1;
					conex-=1;
					portalOK=true;

					
					pingCountDown.play();
				}
			}

			Ta=T;

			if((electro<=0 ) || (Wmat<=0) || (cool<=0)){
				show=false;
				nidaiOK=false;
				indice=-1;
				portalOK=false;
				KonamiTempus=10;
				conex=0;

				bOK=false;
				cOK=false;
				dOK=false;
				eOK=false;
				fOK=false;
				gOK=false;
				ordenOK=false;
				magneto=false;
				
			}
	}else{
			
			show=false;
			nidaiOK=false;
			indice=-1;
	
	}
	if((conex<20)||(electro<20)||(Wmat<20)||(cool<20)||(!ordenOK)){
		if(!alert.getIsPlaying()){
			alert.play();
		}
	
	}

	return finish;

}

bool testApp::drawA(){
	bool finish = false;
		mono.drawString("Portal open with "+ofToString(conex)+"% of stability", linePosX, showPos);

	return finish;

}

//**********************************************
//**ichidai plug w_matter
//**********************************************
bool testApp::updateB(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;
	
	if(T==(countdownB+5)){
		show=false;
		ichidaiOK=false;
		indice=-1;
		if(electro>=0 && !bOK){
			bOK=true;
			ordenOK=true;
		}else{
			bOK=false;
			ordenOK=false;
		}
	}
	
	if(T!=Ta&&T<=countdownB){
		if ((electro>0 ) && !(Wmat+10>=WmatMAX)){
			electro-=1;
			//Wmat+=10;
			
			pingCountDown.play();
			
		}
	}
	Ta=T;
	return finish;

}

bool testApp::drawB(){
	bool finish = false;
	if(T<10){
		mono.drawString("Connecting W matter..."+ofToString(countdownB-T), linePosX, showPos);
	}
	if(T>=10){
		mono.drawString("W matter Connected", linePosX, showPos);
	}
	return finish;

}


//**********************************************
//**ichidai plug cooling
//**********************************************
bool testApp::updateC(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;
	
	if(T==(countdownC+5)){
		show=false;
		ichidaiOK=false;
		indice=-1;
		
		if((electro-3)>=0 && bOK){
			cOK=true;
			ordenOK=true;
		}else{
			cOK=false;
			ordenOK=false;
		}
			
		//esto es en el caso que sea la verison antigua para poder usar el teleporter :P
		
			if(oldVer && (electro-3)>=0){
				cOK=true;
			}
	}
	
	if(T!=Ta&&T<=countdownC){
		if ( (electro-3)>=0 && !(cool+10>=coolMAX)){
			electro-=3;
			cool+=10;
			pingCountDown.play();
		}
	}
	Ta=T;
	return finish;

}

bool testApp::drawC(){
	bool finish = false;
	if(T<10){
		mono.drawString("Cooling System..."+ofToString(countdownC-T), linePosX, showPos);
	}
	if(T>=10){
		mono.drawString("System Cooling: OK", linePosX, showPos);
	}
	return finish;

}

//**********************************************
//**ichidai plug toroid
//**********************************************
bool testApp::updateD(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;
	
	if(T==(countdownD+5)){
		show=false;
		ichidaiOK=false;
		indice=-1;
		magneto = true;
		if((electro-7)>=0&&bOK&&cOK && !dOK){
			dOK=true;
			ordenOK=true;
		}else{
			dOK=false;
			ordenOK=false;
		}
		if(oldVer && (electro-7)>=0 &&cOK){
				dOK=true;
			}
	}
	
	if(T!=Ta&&T<=countdownD){
		if ((electro-7)>=0){
			electro-=7;
			pingCountDown.play();
		}
	}
	Ta=T;
	return finish;

}

bool testApp::drawD(){
	bool finish = false;
	if(T<10){
		mono.drawString("Initialiting electromagnetic flux..."+ofToString(countdownD-T), linePosX, showPos);
	}
	if(T>=10){
		mono.drawString("Electromagnetic OK", linePosX, showPos);
	}
	return finish;

}


//**********************************************
//**nidai set reader
//**********************************************
bool testApp::updateE(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;
	
	if(T==(countdownE+5)){
		show=false;
		nidaiOK=false;
		indice=-1;
		if( (electro-7)>=0 && bOK && cOK && dOK && !eOK){
			eOK=true;
			ordenOK=true;
		}else{
			eOK=false;
			ordenOK=false;
		}
		
		//esto es en el caso que sea la verison antigua para poder usar el teleporter :P
		
			if(oldVer && (electro-7)>=0){
				eOK=true;
			}
	}
	
	if(T!=Ta&&T<=countdownE){
		pingCountDown.play();
	}
	Ta=T;
	return finish;

}

bool testApp::drawE(){
	bool finish = false;
	if(T<10){
		mono.drawString("Sending command..."+ofToString(countdownE-T), linePosX, showPos);
	}
	if(T>=10){
		mono.drawString("Command Sent", linePosX, showPos);
	}
	return finish;

}


//**********************************************
//**sandai show connections
//**********************************************
bool testApp::updateF(){
	bool finish = false;
	
	

	
	if(!selectionOK){	
		Ti=ofGetElapsedTimeMillis();
		Ta=0;
	}
	
	if(selectionOK){
		int Tact=ofGetElapsedTimeMillis();
		T=(Tact-Ti)/1000;
		
		if(gameON){

			sinc =100-(((fabs(ofToFloat(Wrlds[worldNum])/(2*700000)-n))+(fabs(ofToFloat(Wrlds[worldNum])/(2*700000)-g)))/2*100);
			
		}
		if(T>30 && T<countdownF){
			gameON=false;
			if(sinc>95){
				gameOK=true;
			}
		
		}
		if(T==(countdownF+5)){
			show=false;
			sandaiOK=false;
			indice=-1;
			selectionOK=false;
			gameON=false;
			gameOK=false;
			g=0.1;
			n=0.1;
			if(bOK && cOK && dOK && eOK && !fOK){
				fOK=true;
				ordenOK=true;
			}else{
				fOK=false;
				ordenOK=false;
			}
		}
		if(T!=Ta&&T<=10){
			pingCountDown.play();
		}
		Ta=T;
	}
	
	
	
	return finish;

}

bool testApp::drawF(){
	bool finish = false;
	int oldie=388;
	if(!selectionOK){
		int cuadrado = 280/WorldMAX;
		ofSetColor(255, 255, 255);
		
		mono.drawString("Select wave to work:", sandaX, sandaY);
		ofNoFill();
		for(int i=0;i<WorldMAX;i++){
			if(i==worldNum){
				ofSetColor(255, 255, 0);
			}else{
				ofSetColor(255, 255, 255);
			}
			if(oldVer){
				ofRect(sandaX-14,sandaY+6+i*cuadrado,400,cuadrado);
			}else{
				ofEnableAlphaBlending();
					minipant.draw(sandaX-14,sandaY+6+i*cuadrado);
				ofDisableAlphaBlending();
			}
			//mono.drawString("World: "+ofToString(ofToFloat(Wrlds[i])/(2*700000))+"      "+ofToString(worldNum),sandaX-14,sandaY+20+i*cuadrado);
		}
					if(!oldVer){
						oldie=388;
					}else{
						oldie=400;
					}
					
		ofSetColor(255, 255, 255);
			
		for(int i=0;i<WorldMAX;i++){
			glBegin(GL_LINES);
				int k=0;
				double s=1;
				double tMov=ofGetElapsedTimef()*6;
				s=ofToFloat(Wrlds[i])/(2*700000);
				for(int j= 1 ;j<oldie;j++){
					if(oldVer){
						if(i==worldNum){
							ofSetColor(255, 255, 0);
						}else{
							ofSetColor(255, 255, 255);
						}
						k=sandaY+6+(cuadrado/2)+i*cuadrado;
						glVertex2f(sandaX-14+(j-1),k+sin((double) ((j-1)/(20*s))-tMov)*(20*s));
						glVertex2f(sandaX-14+j,k+sin((double) (j/(20*s))-tMov)*(20*s));
					}else{
						ofSetColor(100, 100, 225);
						k=sandaY+6+(cuadrado/2)+i*cuadrado;
						glVertex2f(sandaX-8+(j-1),k+sin((double) ((j-1)/(20*s))-tMov)*(20*s));
						glVertex2f(sandaX-5+j, k+sin((double) (j/(20*s))-tMov)*(20*s));
					}
			

				}
			glEnd();
		
		}
	
	}
	if(selectionOK){
			ofSetColor(255, 255, 255);
		if(T<10){
			mono.drawString("Wave "+ofToString(worldNum)+" look for aproximate it in "+ofToString(10-T),sandaX,sandaY);
			if(!oldVer){
						oldie=396;
					}else{
						oldie=400;
					}
			int cuadrado = 280/WorldMAX;
			glBegin(GL_LINES);
				int k=0;
				double s=1;
				double tMov=ofGetElapsedTimef()*2;
				s=ofToFloat(Wrlds[worldNum])/(2*700000)*6;
				for(int j= 1 ;j<oldie;j++){
					if(oldVer){
						k=sandaY+6+(cuadrado/2)+2*cuadrado;
						glVertex2f(sandaX-14+(j-1),k+sin((double) ((j-1)/(20*s))-tMov)*(20*s));
						glVertex2f(sandaX-14+j,k+sin((double) (j/(20*s))-tMov)*(20*s));
					}else{
						ofSetColor(100, 100, 225);
						k=sandaY+6+(cuadrado/2)+2*cuadrado;
						glVertex2f(sandaX-14+(j-1),k+sin((double) ((j-1)/(20*s))-tMov)*(20*s));
						glVertex2f(sandaX-8+j, k+sin((double) (j/(20*s))-tMov)*(20*s));
					}
				}
			glEnd();
		}else{
			gameON=true;
		}
		if((T<30)&&gameON){
			mono.drawString("Aproximate wave "+ofToString(worldNum)+" with arrows in "+ofToString(30-T),sandaX,sandaY);
			if(!oldVer){
						oldie=396;
					}else{
						oldie=400;
					}
			int cuadrado = 280/WorldMAX;
			glBegin(GL_LINES);
				int k=0;
				double s=1;
				double tMov=ofGetElapsedTimef()*2;
				s=g*6;
				for(int j= 1 ;j<oldie;j++){
					if(oldVer){
						k=sandaY+6+(cuadrado/2)+2*cuadrado;
						glVertex2f(sandaX-14+(j-1),k+sin((double) ((j-1)/(20*s))-tMov)*(20*n*6));
						glVertex2f(sandaX-14+j,k+sin((double) (j/(20*s))-tMov)*(20*n*6));
					}else{
						ofSetColor(100, 100, 225);
						k=sandaY+6+(cuadrado/2)+2*cuadrado;
						glVertex2f(sandaX-14+(j-1),k+sin((double) ((j-1)/(20*s))-tMov)*(20*n*6));
						glVertex2f(sandaX-8+j, k+sin((double) (j/(20*s))-tMov)*(20*n*6));
					}
				}
			glEnd();
		mono.drawString("Sincronitzation: "+ofToString(sinc)+"%",sandaX,sandaY+275);
		}
		if(T>30 && T<countdownF){
			if(gameOK){
				mono.drawString("Final sincronitzation: "+ofToString(sinc)+"%",sandaX,sandaY+6+(280/WorldMAX/2)+2*280/WorldMAX);
				mono.drawString("the number connection is: '"+Wrlds[worldNum]+"'",sandaX,sandaY+26+(280/WorldMAX/2)+2*280/WorldMAX);
			
			}else{
				mono.drawString("Final sincronitzation: "+ofToString(sinc)+"%",sandaX,sandaY+6+(280/WorldMAX/2)+2*280/WorldMAX);
				mono.drawString("Error, try again",sandaX,sandaY+26+(280/WorldMAX/2)+2*280/WorldMAX);
			
			}
		
		}
	
	}
	
	ofSetColor(255, 255, 0);
	if(!selectionOK){
		mono.drawString("showing connections"+ofToString(countdownF-T), linePosX, showPos);
	}
	if(selectionOK){
		mono.drawString("Look & Aproximate", linePosX, showPos);
	}
	return finish;

}


//**********************************************
//**nidai connect XXXXXX
//**********************************************
bool testApp::updateG(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;

		for( int i = 0; i < WorldMAX; i++ ) {

			cPos=WorldPass.find(Wrlds[i]);
					
			if(cPos!=string::npos){
						
				worldOK=true;
				break;
			}else{
				worldOK=false;
			}
		}

	if(T==(countdownG+5)){
		show=false;
		nidaiOK=false;
		indice=-1;
		if(worldOK){
			if(bOK && cOK &&  dOK && eOK && fOK && !gOK){
				gOK=true;
				ordenOK=true;
				conex=60;
			}else{
				gOK=false;
				ordenOK=false;
			}
		}
	}
	
	if(T!=Ta&&T<=countdownG){
		pingCountDown.play();
	}
	Ta=T;
	return finish;

}

bool testApp::drawG(){
	bool finish = false;
	if(T<10){
		mono.drawString("Connecting..."+ofToString(countdownG-T), linePosX, showPos);
	}
	if(T>=10){
		if(worldOK){
			mono.drawString("Connected to '"+WorldPass+"'", linePosX, showPos);
		}else{
			mono.drawString("Error in '"+WorldPass+"'", linePosX, showPos);
		}
	}
	return finish;

}


//**********************************************
//**nidai check beacon XX
//**********************************************
bool testApp::updateH(){
	bool finish = false;
	int Tact=ofGetElapsedTimeMillis();
	int hab = ofToInt(beaconPass);

	T=(Tact-Ti)/1000;

		
	if(T==(countdownH+5)){
		if((hab>roomMAX) || (hab<0)){
			hOK= false;
		}else{
			hOK= true;
		}
		show=false;
		nidaiOK=false;
		indice=-1;
	}
	
	if(T!=Ta&&T<=countdownH){
		pingCountDown.play();
	}
	Ta=T;
	return finish;

}

bool testApp::drawH(){
	bool finish = false;
	
	int hab = ofToInt(beaconPass);

	if(T<countdownH){
		mono.drawString("Checking..."+ofToString(hab)+" in "+ofToString(countdownH-T), linePosX, showPos);
	}
	if(T>=countdownH){
			//mono.drawString("Hola", linePosX+100, showPos);
		if((hab<roomMAX) && (hab>0)){
			if(rooms[hab]==true){
				mono.drawString("Room "+ofToString(hab)+" its ready", linePosX, showPos);
			}else{
				mono.drawString("Room "+ofToString(hab)+" its not ready", linePosX, showPos);
		
			}
		}else{
			mono.drawString("Room "+ofToString(hab)+" not exist", linePosX, showPos);
		}
	}
	return finish;

}
//**********************************************
//**sandai anchor connect XX
//**********************************************
bool testApp::updateI(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;

	int hab = ofToInt(beaconPass);


	if(T==(countdownI+5)){
		show=false;
		sandaiOK=false;
		indice=-1;
		if((hab<roomMAX) && (hab>0)){
			if(rooms[hab]==true){
				iOK=true;
				conex=60;
				telportDest=hab;
			}
		}
	}
	
	if(T!=Ta&&T<=countdownI){
		pingCountDown.play();
	}
	Ta=T;
	return finish;

}

bool testApp::drawI(){
	bool finish = false;
	int hab = ofToInt(beaconPass);
	if(T<countdownI){
		mono.drawString("Connecting to room "+beaconPass+" in..."+ofToString(countdownG-T), linePosX, showPos);
	}
	if(T>=countdownI){
	if((hab<roomMAX) && (hab>0)){
		if(rooms[hab]==true){
			mono.drawString("Connected to room "+beaconPass, linePosX, showPos);
		}else{
			mono.drawString("Error in room "+beaconPass, linePosX, showPos);
		}
	}else{
		mono.drawString("Room "+ofToString(hab)+" not exist", linePosX, showPos);
	}
	}
	return finish;

}
//**********************************************
//**La J es la funcion "muestro ERROR"
//**********************************************



//**********************************************
//**ALTRES FUNCIONS
//**********************************************


//**********************************************
//**ichidai show power
//**********************************************
bool testApp::updateK(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;

	
	if(T==(countdownK+1)){

		show=false;
		ichidaiOK=false;
		indice=-1;
		ShowPower = true;
	}
	
	if(T!=Ta&&T<=countdownK){
		pingCountDown.play();
	}
	Ta=T;
	return finish;

}

bool testApp::drawK(){
	bool finish = false;
	if(T<countdownK){
		mono.drawString("Updating voltages..."+ofToString(countdownK-T), linePosX, showPos);
	}
	if(T>=countdownK){

			mono.drawString("Voltages Ok", linePosX, showPos);
		
	}
	return finish;

}
//**********************************************
//**ichidai show cooling
//**********************************************
bool testApp::updateL(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;

	
	if(T==(countdownL+1)){
		
		for(int i = 0;i<maxtemp;i++){
			if(magneto){
				temp[i]+=ofRandom(10, 50) ;
			}

		}
		Showtemp = true;
		show=false;
		ichidaiOK=false;
		indice=-1;
	}
	
	if(T!=Ta&&T<=countdownL){
		pingCountDown.play();
	}
	Ta=T;
	return finish;

}

bool testApp::drawL(){
	bool finish = false;
	if(T<countdownL){
		mono.drawString("Updating Temp's..."+ofToString(countdownL-T), linePosX, showPos);
	}
	if(T>=countdownL){

			mono.drawString("Temp's updated Ok", linePosX, showPos);
		
	}
	return finish;

}
//**********************************************
//**ichidai show w_matter
//**********************************************
bool testApp::updateM(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;

	
	if(T==(countdownM+1)){

		show=false;
		ichidaiOK=false;
		indice=-1;
		ShowTubosWmat = true;
	}
	
	if(T!=Ta&&T<=countdownM){
		pingCountDown.play();
	}
	Ta=T;
	return finish;

}

bool testApp::drawM(){
	bool finish = false;
	if(T<countdownM){
		mono.drawString("Updating W_Matter..."+ofToString(countdownM-T), linePosX, showPos);
	}
	if(T>=countdownM){

			mono.drawString("W_matter updated Ok", linePosX, showPos);
		
	}
	return finish;

}

//**********************************************
//**nidai start teleport
//**********************************************
bool testApp::updateN(){
	bool finish = false;
	
	int Tact=ofGetElapsedTimeMillis();

	T=(Tact-Ti)/1000;

	if(cOK &&  dOK && eOK && hOK && iOK){
		
		if(conex==0){
			show=false;
			nidaiOK=false;
			indice=-1;
			teleportOK=false;
			KonamiTempus=10;
			conex=0;
			bOK=false;
			cOK=false;
			dOK=false;
			eOK=false;
			fOK=false;
			gOK=false;
			hOK=false;
			iOK=false;
			ordenOK=false;
				magneto=false;
		}
	
			if(T!=Ta&&conex>=0){
				if ((electro>=0 ) && (cool>=0)){
					electro-=1;
					cool-=1;
					conex-=1;
					teleportOK=true;

					
					pingCountDown.play();
				}
			}

			Ta=T;

			if((electro<=0 ) || (cool<=0)){
				show=false;
				nidaiOK=false;
				indice=-1;
				teleportOK=false;
				KonamiTempus=10;
				conex=0;

				bOK=false;
				cOK=false;
				dOK=false;
				eOK=false;
				fOK=false;
				gOK=false;
				hOK=false;
				iOK=false;
				ordenOK=false;
				magneto=false;
				
			}
	}else{
			
			show=false;
			nidaiOK=false;
			indice=-1;
	
	}
	
	
	if((conex<20)||(electro<20)||(cool<20)){
		if(!alert.getIsPlaying()){
			alert.play();
		}
	
	}
	return finish;

}

bool testApp::drawN(){
	bool finish = false;
		mono.drawString("Teleport Opened to "+ofToString(telportDest)+" with "+ofToString(conex)+"% of stability", linePosX, showPos);

	return finish;

}

//**********************************************
//**INICIO "ACCIDENTAL" de 90seg
//**********************************************
bool testApp::StartInitial(){
	bool finish = false;

			nidaiOK=true;
			indice=2;
			conex=90;
			bOK=true;
			cOK=true;
			dOK=true;
			eOK=true;
			fOK=true;
			gOK=true;
			ordenOK=true;
			electro=200;
			Wmat=100;
			cool=100;
			conex=90;
			magneto=1;


	return finish;

}