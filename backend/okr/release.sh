#!/bin/bash
# sh release.sh qa 1.1

echo "envirnment: $1"
echo "current version: $2"

bump=0.01
#newVersion=$(($2 + $bump))
newVersion=`echo $2 + $bump | bc`
oldimage="mogiio/image-config:v$2"
image="mogiio/image-config:v$newVersion"

docker build -t $image .
docker push $image

cat kube-setup-$1.yaml | sed "s|${oldimage}|${image}|g" > kube-setup-$1-1.yaml; mv -f kube-setup-$1-1.yaml kube-setup-$1.yaml

kubectl apply -f kube-setup-$1.yaml