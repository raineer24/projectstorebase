git stash
git co develop
git pull origin develop
git co deploy-develop
npm run build--prod
git add dist/* -f
git add -u
git commit -m "Deploy"
eb deploy
