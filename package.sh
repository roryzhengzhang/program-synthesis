cd back-end
mvn package
cp target/back-end-0.0.1-SNAPSHOT-jar-with-dependencies.jar ../ips-backend.jar
cp -R lib/ ../lib
cd ..
zip -r ips.zip lib/ ips-backend.jar front-end/ back-end/
rm -r lib/
rm ips-backend.jar