# Vérifier que l'image Docker a été correctement poussée

Ce document explique comment vérifier qu'une image Docker a été correctement poussée vers un registre privé ou public.

## Commandes pour un registre privé

### 1. Se connecter au registre privé

```bash
docker login <registry-url> -u <username> -p <password>
```

Exemple:
```bash
docker login registry.home.keveun.net -u $PRIVATE_REGISTRY_USER -p $PRIVATE_REGISTRY_PASSWORD
```

> Note: Pour des raisons de sécurité, il est préférable d'utiliser des variables d'environnement pour les identifiants plutôt que de les saisir directement dans la commande.

### 2. Vérifier les tags disponibles via l'API Registry

La méthode la plus fiable pour vérifier si une image existe dans le registre est d'utiliser l'API Docker Registry:

```bash
curl -X GET https://<registry-url>/v2/<image-name>/tags/list -u <username>:<password>
```

Exemple:
```bash
curl -X GET https://registry.home.keveun.net/v2/gateauyahourt/capture/tags/list -u $PRIVATE_REGISTRY_USER:$PRIVATE_REGISTRY_PASSWORD
```

Réponse attendue si l'image existe:
```json
{"name":"gateauyahourt/capture","tags":["main","sha-4979c2f"]}
```

### 3. Tirer (pull) l'image pour vérifier qu'elle est accessible

**Important**: L'image doit être tirée (pull) localement avant de pouvoir l'inspecter avec `docker inspect`.

```bash
docker pull <registry-url>/<image-name>:<tag>
```

Exemple:
```bash
docker pull registry.home.keveun.net/gateauyahourt/capture:main
```

ou

```bash
docker pull registry.home.keveun.net/gateauyahourt/capture:sha-4979c2f
```

### 4. Lister les images locales pour confirmer le pull

```bash
docker image ls | grep capture
```

### 5. Vérifier les détails de l'image (après l'avoir tirée)

Pour voir les détails de l'image, y compris les métadonnées et les labels:

```bash
docker inspect <registry-url>/<image-name>:<tag>
```

Exemple:
```bash
docker inspect registry.home.keveun.net/gateauyahourt/capture:main
```

**Note**: Si vous obtenez l'erreur `No such object`, cela signifie que l'image n'a pas été tirée localement. Exécutez d'abord la commande `docker pull`.

### 6. Vérifier les architectures supportées par l'image

Pour vérifier qu'une image supporte plusieurs architectures (AMD64 et ARM64):

```bash
docker manifest inspect <registry-url>/<image-name>:<tag>
```

Exemple:
```bash
docker manifest inspect registry.home.keveun.net/gateauyahourt/capture:main
```

Cette commande affichera les différentes variantes d'architecture disponibles pour l'image. Vous devriez voir des entrées pour `linux/amd64` et `linux/arm64`.

**Note**: Vous devrez peut-être activer les fonctionnalités expérimentales de Docker pour utiliser cette commande:
```bash
export DOCKER_CLI_EXPERIMENTAL=enabled
```

## Commandes pour GitHub Container Registry (ghcr.io)

### 1. Se connecter à GitHub Container Registry

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u <github-username> --password-stdin
```

### 2. Lister et tirer les images

```bash
docker pull ghcr.io/<github-username>/<image-name>:<tag>
```

Exemple:
```bash
docker pull ghcr.io/gateauyahourt/capture:main
```

## Vérification via une interface web

De nombreux registres Docker offrent également une interface web pour vérifier les images:

- **GitHub Container Registry**: Accessible via l'onglet "Packages" de votre compte GitHub
- **Docker Hub**: https://hub.docker.com/
- **AWS ECR**: Via la console AWS
- **Google GCR**: Via la console Google Cloud
- **Azure ACR**: Via le portail Azure

## Vérification via des API REST

Pour une vérification automatisée, vous pouvez utiliser les API REST des registres:

### Docker Registry API v2

```bash
curl -X GET https://<registry-url>/v2/<image-name>/tags/list -u <username>:<password>
```

Exemple:
```bash
curl -X GET https://registry.home.keveun.net/v2/gateauyahourt/capture/tags/list -u $PRIVATE_REGISTRY_USER:$PRIVATE_REGISTRY_PASSWORD
```

## Dépannage

Si vous ne pouvez pas voir ou tirer l'image:

1. **Problèmes d'authentification**:
   - Vérifiez que vous êtes correctement connecté au registre
   - Assurez-vous que vos identifiants sont valides

2. **Problèmes de permissions**:
   - Vérifiez que vous avez les droits pour accéder à l'image
   - Pour les registres privés, assurez-vous que votre compte a accès au dépôt

3. **Problèmes de réseau**:
   - Vérifiez que vous pouvez accéder au registre (ping, telnet)
   - Vérifiez les pare-feu ou les restrictions réseau

4. **Problèmes de nommage**:
   - Vérifiez que vous utilisez le bon nom d'image et le bon tag
   - Assurez-vous que le format de l'URL du registre est correct
