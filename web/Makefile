tencent-yarn:
	yarn --registry=http://mirrors.cloud.tencent.com/npm/


build: build-frontend build-nginx


build-frontend:
	# build
	rm -r ./build 2>&1 > /dev/null || echo "clean build"
	docker build -f nodejs.docker -t wow_salary_nodejs:latest .

	# get the result
	docker rm wow_salary.nodejs.files 2>&1 > /dev/null || echo "rm nodejs"
	docker run --name wow_salary.nodejs.files wow_salary_nodejs:latest
	docker cp wow_salary.nodejs.files:/usr/src/app/build ./build

	# clean
	docker rm wow_salary.nodejs.files
	docker rmi wow_salary_nodejs:latest


build-nginx:
	docker build -f nginx.docker -t wow_salary_nginx:latest .

run-nginx:
	docker stop www.wow-salary.nginx 2>&1 > /dev/null || echo "stop"
	docker rm www.wow-salary.nginx 2>&1 > /dev/null || echo "clean"
	docker run \
		--name www.wow-salary.nginx \
		--env "VIRTUAL_HOST=wow-salary.word-collect.com" \
		--env "VIRTUAL_PORT=80" \
		--env "LETSENCRYPT_HOST=wow-salary.word-collect.com" \
		--env "LETSENCRYPT_EMAIL=zhenguolin@me.com" \
		-d \
		wow_salary_nginx:latest
